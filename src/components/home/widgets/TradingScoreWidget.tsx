

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
import { usePlugin } from '../../../hooks/usePlugin';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  fetchDashboardData,
  type Trade,
} from '../../dashboard/utils/dataUtils';
import type { FilterState } from '../../dashboard/DashboardView';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import {
  calculateTradingScore,
  TradingScoreResult,
  AxisScores,
  getScoreLabel,
  AXIS_WEIGHTS,
} from '../../../utils/tradingScoreUtils';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { t, tPlural } from '../../../lang/helpers';


type TradingScoreWidgetProps = Record<string, never>;

const AXIS_SCORE_KEYS: Array<keyof AxisScores> = [
  'profitability',
  'riskManagement',
  'execution',
  'consistency',
  'returnConsistency',
  'experience',
];

interface RadarDataPoint {
  [key: string]: string | number | undefined;
  axis: string;
  axisKey: keyof AxisScores;
  value: number;
  allAccountsValue?: number;
  fullMark: 100;
  weight: number;
}

interface AccountTradingScore {
  account: string;
  scoreResult: TradingScoreResult;
}

interface RadarSeries {
  key: string;
  label: string;
  legendLabel: string;
  color: string;
  scoreResult: TradingScoreResult;
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

const ACCOUNT_RADAR_COLORS = [
  'var(--color-green, #22c55e)',
  'var(--color-yellow, #eab308)',
  'var(--color-cyan, #06b6d4)',
  'var(--color-pink, #ec4899)',
  'var(--color-orange, #f97316)',
  'var(--color-red, #ef4444)',
];

const MAX_VISIBLE_LEGEND_ACCOUNTS = 3;
const EMPTY_TRADES: Trade[] = [];

const getAccountFilterKey = (accounts: string[]): string =>
  accounts.join('\u0000');

const getTradeAccountLookupKeys = (trade: Trade): string[] => {
  const lookupKeys = new Set<string>();

  for (const key of trade.accountLookupKeys ?? []) {
    lookupKeys.add(normalizeAccountLookupKey(key));
  }

  for (const accountName of trade.accountNamesNormalized ?? []) {
    lookupKeys.add(normalizeAccountLookupKey(accountName));
  }

  const accountValue = trade.account;
  if (Array.isArray(accountValue)) {
    for (const accountName of accountValue) {
      lookupKeys.add(normalizeAccountLookupKey(String(accountName)));
    }
  } else if (typeof accountValue === 'string') {
    lookupKeys.add(normalizeAccountLookupKey(accountValue));
  }

  return [...lookupKeys];
};

const getAccountScoreResultsFromTrades = (
  trades: Trade[],
  accounts: string[]
): AccountTradingScore[] =>
  accounts.flatMap((account) => {
    const accountLookupKey = normalizeAccountLookupKey(account);
    const accountTrades = trades.filter((trade) =>
      getTradeAccountLookupKeys(trade).includes(accountLookupKey)
    );

    return accountTrades.length > 0
      ? [{ account, scoreResult: calculateTradingScore(accountTrades) }]
      : [];
  });

const getCompactAccountLabel = (accountName: string): string => {
  const trimmedName = accountName.trim();
  const accountIdMatch = trimmedName.match(/\bAccount-\d+\b/i);
  if (accountIdMatch) return accountIdMatch[0].replace(/^Account-/i, 'Acct-');

  if (trimmedName.length <= 12) return trimmedName;

  const words = trimmedName.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const initials = words
      .slice(0, 3)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('');

    return initials || trimmedName.slice(0, 12);
  }

  return trimmedName.slice(0, 12);
};

const scoreAxesAreSame = (
  scoreA: TradingScoreResult,
  scoreB: TradingScoreResult | null
): boolean => {
  if (!scoreB) return true;

  return AXIS_SCORE_KEYS.every(
    (axisKey) => scoreA.axisScores[axisKey] === scoreB.axisScores[axisKey]
  );
};

const useTradingScoreComparison = (
  filters: FilterState,
  enabled: boolean,
  selectedTrades: Trade[]
): {
  allAccountsScoreResult: TradingScoreResult | null;
  accountScoreResults: AccountTradingScore[];
  accountFilterKey: string;
  refreshSource: unknown;
} => {
  const plugin = usePlugin();
  const [comparison, setComparison] = useState<{
    allAccountsScoreResult: TradingScoreResult | null;
    accountScoreResults: AccountTradingScore[];
    accountFilterKey: string;
    refreshSource: unknown;
  }>({
    allAccountsScoreResult: null,
    accountScoreResults: [],
    accountFilterKey: '',
    refreshSource: null,
  });

  useEffect(() => {
    if (!enabled || !plugin?.app || !plugin.tradeService) {
      setComparison({
        allAccountsScoreResult: null,
        accountScoreResults: [],
        accountFilterKey: '',
        refreshSource: null,
      });
      return;
    }

    let cancelled = false;
    const allAccountFilters: FilterState = { ...filters, accounts: [] };
    const accountFilterKey = getAccountFilterKey(filters.accounts);

    const loadScore = async () => {
      if (cancelled) return;

      const allAccountData = await fetchDashboardData(
        plugin.app,
        plugin.tradeService,
        allAccountFilters,
        plugin.settings?.trade?.defaultRiskAmount,
        plugin
      );

      const accountScoreResults =
        filters.accounts.length > 1
          ? getAccountScoreResultsFromTrades(selectedTrades, filters.accounts)
          : [];

      if (!cancelled) {
        setComparison({
          allAccountsScoreResult:
            allAccountData.trades.length > 0
              ? calculateTradingScore(allAccountData.trades)
              : null,
          accountScoreResults,
          accountFilterKey,
          refreshSource: selectedTrades,
        });
      }
    };

    void loadScore();

    return () => {
      cancelled = true;
    };
  }, [enabled, filters, plugin, selectedTrades]);

  return comparison;
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
  const { dashboardData, filters } = useDashboardData();
  const { formatValue, shouldMask } = useDisplayFormatter();
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

  const isMetricMasked = shouldMask('metric');
  const selectedAccountFilterKey = getAccountFilterKey(filters.accounts);
  const scoreRefreshSource = dashboardData?.trades ?? EMPTY_TRADES;
  const {
    allAccountsScoreResult,
    accountScoreResults,
    accountFilterKey: comparisonAccountFilterKey,
    refreshSource: comparisonRefreshSource,
  } = useTradingScoreComparison(
    filters,
    filters.accounts.length > 0 && !isMetricMasked,
    scoreRefreshSource
  );
  const isComparisonCurrent =
    comparisonAccountFilterKey === selectedAccountFilterKey &&
    comparisonRefreshSource === scoreRefreshSource;

  const accountRadarSeries = useMemo((): RadarSeries[] => {
    if (!scoreResult || filters.accounts.length === 0 || !isComparisonCurrent) {
      return [];
    }

    if (filters.accounts.length === 1) {
      return [
        {
          key: 'value',
          label: filters.accounts[0],
          legendLabel: getCompactAccountLabel(filters.accounts[0]),
          color: getScoreLabel(scoreResult.compositeScore).color,
          scoreResult,
        },
      ];
    }

    if (accountScoreResults.length !== filters.accounts.length) {
      return [
        {
          key: 'value',
          label: filters.accounts.join(', '),
          legendLabel: getCompactAccountLabel(filters.accounts.join(', ')),
          color: getScoreLabel(scoreResult.compositeScore).color,
          scoreResult,
        },
      ];
    }

    return accountScoreResults.map((accountScore, index) => ({
      key: `accountValue${index}`,
      label: accountScore.account,
      legendLabel: getCompactAccountLabel(accountScore.account),
      color: ACCOUNT_RADAR_COLORS[index % ACCOUNT_RADAR_COLORS.length],
      scoreResult: accountScore.scoreResult,
    }));
  }, [accountScoreResults, filters.accounts, isComparisonCurrent, scoreResult]);

  const showAccountComparison = Boolean(
    scoreResult &&
    !isMetricMasked &&
    filters.accounts.length > 0 &&
    isComparisonCurrent &&
    allAccountsScoreResult &&
    accountRadarSeries.some(
      (series) => !scoreAxesAreSame(series.scoreResult, allAccountsScoreResult)
    )
  );

  const visibleAccountRadarSeries = useMemo(
    () => (showAccountComparison ? accountRadarSeries : []),
    [accountRadarSeries, showAccountComparison]
  );

  const visibleLegendSeries = visibleAccountRadarSeries.slice(
    0,
    MAX_VISIBLE_LEGEND_ACCOUNTS
  );
  const hiddenLegendSeriesCount = Math.max(
    0,
    visibleAccountRadarSeries.length - visibleLegendSeries.length
  );

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
      allAccountsValue: showAccountComparison
        ? allAccountsScoreResult?.axisScores[axisKey]
        : undefined,
      ...Object.fromEntries(
        visibleAccountRadarSeries.map((series) => [
          series.key,
          series.scoreResult.axisScores[axisKey],
        ])
      ),
      fullMark: 100,
      weight: AXIS_WEIGHTS[axisKey] * 100,
    }));
  }, [
    allAccountsScoreResult,
    scoreResult,
    showAccountComparison,
    visibleAccountRadarSeries,
  ]);

  
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
          {AXIS_SCORE_KEYS.map((axisKey) => {
            const score = scoreResult.axisScores[axisKey];
            const axisScoreClass = getScoreColorClass(score);
            const weight = Math.round(AXIS_WEIGHTS[axisKey] * 100);
            const isHovered = hoveredAxis === axisKey;
            const axisName = t(`widget.trading-score.axis.${axisKey}` as const);
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
          })}
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
      style={cssVars({
        '--journalit-home-score-selected-color': scoreLabel.color,
      })}
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
            {showAccountComparison ? (
              <>
                <Radar
                  name={`${t('common.all')} accounts`}
                  dataKey="allAccountsValue"
                  stroke="var(--interactive-accent)"
                  fill="var(--interactive-accent)"
                  fillOpacity={0.18}
                  strokeWidth={1.75}
                />
                {visibleAccountRadarSeries.map((series) => (
                  <Radar
                    key={series.key}
                    name={series.label}
                    dataKey={series.key}
                    stroke={series.color}
                    fill={series.color}
                    fillOpacity={0.24}
                    strokeWidth={1.75}
                    strokeDasharray={
                      series.scoreResult.phase === 'developing'
                        ? '4 2'
                        : undefined
                    }
                  />
                ))}
              </>
            ) : (
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
            )}
            <RechartsPortalTooltip chartRef={chartRef}>
              {({ active, payload }: TooltipContentLike<RadarDataPoint>) => {
                const data = payload?.[0]?.payload;

                if (!active || !data) return null;
                const scoreClass = getScoreColorClass(data.value);
                return (
                  <div className="journalit-home-score__tooltip">
                    <div className="journalit-home-score__tooltip-label">
                      {t(`widget.trading-score.axis.${data.axisKey}` as const)}
                    </div>
                    {showAccountComparison ? (
                      <div className="journalit-home-score__tooltip-series">
                        {visibleAccountRadarSeries.map((series) => {
                          const seriesValue = data[series.key];

                          return (
                            <div
                              key={series.key}
                              className="journalit-home-score__tooltip-series-row"
                              style={cssVars({
                                '--journalit-home-score-tooltip-series-color':
                                  series.color,
                              })}
                            >
                              <span className="journalit-home-score__tooltip-series-label">
                                {series.label}
                              </span>
                              <span className="journalit-home-score__tooltip-series-value">
                                {formatValue({
                                  kind: 'metric',
                                  value:
                                    typeof seriesValue === 'number'
                                      ? seriesValue
                                      : undefined,
                                  precision: 0,
                                })}
                              </span>
                            </div>
                          );
                        })}
                        {data.allAccountsValue !== undefined && (
                          <div className="journalit-home-score__tooltip-series-row journalit-home-score__tooltip-series-row--all">
                            <span className="journalit-home-score__tooltip-series-label">
                              {t('common.all')}
                            </span>
                            <span className="journalit-home-score__tooltip-series-value">
                              {formatValue({
                                kind: 'metric',
                                value: data.allAccountsValue,
                                precision: 0,
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`journalit-home-score__tooltip-value ${scoreClass}`}
                      >
                        {formatValue({
                          kind: 'metric',
                          value: data.value,
                          precision: 0,
                        })}
                      </div>
                    )}
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
        {showAccountComparison && (
          <div className="journalit-home-score__legend journalit-home-score__legend--status-left">
            {visibleLegendSeries.map((series) => (
              <span
                key={series.key}
                className="journalit-home-score__legend-item journalit-home-score__legend-item--selected"
                style={cssVars({
                  '--journalit-home-score-legend-color': series.color,
                })}
              >
                {series.legendLabel}
              </span>
            ))}
            {hiddenLegendSeriesCount > 0 && (
              <span className="journalit-home-score__legend-more">
                +{hiddenLegendSeriesCount}
              </span>
            )}
            <span className="journalit-home-score__legend-item journalit-home-score__legend-item--all">
              {t('common.all')}
            </span>
          </div>
        )}
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
