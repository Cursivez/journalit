

import React, { useState } from 'react';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getUserDateFormat } from '../../../utils/dateUtils';
import {
  CurrencyCode,
  parseCuratedCurrencyCode,
} from '../../../utils/currencyConfig';
import { usePlugin } from '../../../hooks/usePlugin';
import {
  projectCurrentPropChallengeRules,
  type ProjectedPropChallengeRules,
} from '../../../services/propChallenge/PropChallengeRuleProjection';
import {
  buildBalanceChartData,
  calculateBalanceChartParams,
  clampDrawdownSeriesToDomain,
  resolveBalanceAxisPrecision,
  startOfLocalDay,
  type BalanceChartDataPoint,
} from './accountBalanceChartModel';
import { AccountBalanceOffScaleLevels } from './AccountBalanceOffScaleLevels';
import { AccountBalanceChartDefs } from './AccountBalanceChartDefs';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { calculateYAxisWidth } from '../../../utils/chartUtils';
import { AccountData, DrawdownType } from '../../../services/account/types';
import { EmptyState } from '../../shared/EmptyState';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { ChartBase } from '../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../charts/RechartsPortalTooltip';
import type { AccountTradeData } from '../../../services/accountPage/types';
import { skipVerticalGridCoordinates } from '../../charts/chartGrid';
import {
  shouldAnimateSeries,
  useChartAnimationActive,
} from '../../charts/chartAnimation';
import { CustomTooltip } from './AccountBalanceChartTooltip';

let accountBalanceChartIdCounter = 0;



interface AccountBalanceChartProps {
  account: AccountData;
  trades: readonly AccountTradeData[];
  height?: number;
  
  currencyOverride?: string;
  
  selectedPhaseId?: string | null;
}



interface BalanceDotContext {
  isPnlMasked: boolean;
  depositStrokeColor: string;
  withdrawalStrokeColor: string;
}

const hiddenDot = <circle cx={0} cy={0} r={0} opacity={0} />;

interface BalanceDotProps {
  cx?: number;
  cy?: number;
  payload?: BalanceChartDataPoint;
}

const getTradePointColor = (
  payload: BalanceChartDataPoint,
  isPnlMasked: boolean,
  fallbackColor: string
): string => {
  if (!payload.isTrade) return fallbackColor;
  if (isPnlMasked) return 'var(--text-muted)';
  if (payload.isConsolidated) {
    return payload.dailyPnL !== undefined && payload.dailyPnL >= 0
      ? 'var(--text-success)'
      : 'var(--text-error)';
  }
  if (payload.transaction) {
    return payload.transaction.amount >= 0
      ? 'var(--text-success)'
      : 'var(--text-error)';
  }
  return fallbackColor;
};

const renderCashflowDot = (
  cx: number,
  cy: number,
  stroke: string,
  active: boolean
) => (
  <g>
    <line
      x1={cx}
      y1={cy - (active ? 18 : 15)}
      x2={cx}
      y2={cy + (active ? 18 : 15)}
      stroke={stroke}
      strokeWidth={active ? '3' : '2'}
    />
    <circle
      cx={cx}
      cy={cy}
      r={active ? '7' : '5'}
      fill="var(--background-primary)"
      stroke={stroke}
      strokeWidth="2"
    />
  </g>
);

const renderBalanceDot = (
  props: BalanceDotProps,
  context: BalanceDotContext
) => {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return hiddenDot;
  if (payload.isDeposit) {
    return renderCashflowDot(cx, cy, context.depositStrokeColor, false);
  }
  if (payload.isWithdrawal) {
    return renderCashflowDot(cx, cy, context.withdrawalStrokeColor, false);
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={payload.isTrade ? '4' : '3'}
      fill={getTradePointColor(
        payload,
        context.isPnlMasked,
        'var(--text-muted)'
      )}
      stroke="var(--background-primary)"
      strokeWidth="1"
    />
  );
};

const renderActiveBalanceDot = (
  props: BalanceDotProps,
  context: BalanceDotContext
) => {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return hiddenDot;
  if (payload.isDeposit) {
    return renderCashflowDot(cx, cy, context.depositStrokeColor, true);
  }
  if (payload.isWithdrawal) {
    return renderCashflowDot(cx, cy, context.withdrawalStrokeColor, true);
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r="6"
      fill={getTradePointColor(
        payload,
        context.isPnlMasked,
        'var(--interactive-accent)'
      )}
      stroke="var(--background-primary)"
      strokeWidth="2"
    />
  );
};

const AccountBalanceChartEmpty: React.FC<{ height: number }> = ({ height }) => (
  <div
    className="journalit-account-chart-empty"
    style={cssVars({ '--account-chart-empty-height': `${height}px` })}
  >
    <EmptyState
      message={t('account.balance-chart.empty')}
      subMessage={t('account.balance-chart.empty-sub')}
    />
  </div>
);

const calculateBalanceColorTransitionOffsets = (
  displayChartData: Array<{ displayBalance: number }>,
  baseline: number
) => {
  const balanceValues = displayChartData.map((point) => point.displayBalance);
  const balanceMin = Math.min(...balanceValues);
  const balanceMax = Math.max(...balanceValues);

  if (balanceMin >= baseline) {
    return { area: 100, stroke: 100 };
  }

  if (balanceMax <= baseline) {
    return { area: 0, stroke: 0 };
  }

  const strokeRange = balanceMax - balanceMin;
  const transitionOffset = Math.max(
    0,
    Math.min(100, ((balanceMax - baseline) / strokeRange) * 100)
  );

  return {
    area: transitionOffset,
    stroke: transitionOffset,
  };
};

interface AccountBalanceChartSeriesProps {
  balanceStrokeGradientId: string;
  isAnimationActive: boolean;
  showDots: boolean;
  isPnlMasked: boolean;
  depositStrokeColor: string;
  withdrawalStrokeColor: string;
  onAnimationEnd: () => void;
}

const AccountBalanceChartSeries: React.FC<AccountBalanceChartSeriesProps> = ({
  balanceStrokeGradientId,
  isAnimationActive,
  showDots,
  isPnlMasked,
  depositStrokeColor,
  withdrawalStrokeColor,
  onAnimationEnd,
}) => (
  <Line
    type="monotone"
    dataKey="displayBalance"
    stroke={`url(#${balanceStrokeGradientId})`}
    strokeWidth={3}
    isAnimationActive={isAnimationActive}
    onAnimationEnd={onAnimationEnd}
    dot={
      showDots &&
      ((props: BalanceDotProps) =>
        renderBalanceDot(props, {
          isPnlMasked,
          depositStrokeColor,
          withdrawalStrokeColor,
        }))
    }
    activeDot={(props: BalanceDotProps) =>
      renderActiveBalanceDot(props, {
        isPnlMasked,
        depositStrokeColor,
        withdrawalStrokeColor,
      })
    }
    name="Balance"
  />
);


function useAccountBalanceChartModel(
  account: AccountData,
  trades: readonly AccountTradeData[],
  currency: CurrencyCode,
  isBalanceMasked: boolean,
  
  selectedPhaseId?: string | null
) {
  
  
  
  
  const propChallengeOverlay = React.useMemo(
    () =>
      selectedPhaseId === null
        ? undefined
        : projectCurrentPropChallengeRules(
            account.propChallenge,
            new Date(),
            selectedPhaseId
          ),
    [account.propChallenge, selectedPhaseId]
  );
  const { formatValue } = useDisplayFormatter();
  const userDateFormat = React.useMemo(() => getUserDateFormat(), []);
  const plugin = usePlugin();

  
  const getTradingDayKey = React.useCallback((date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

  const chartData = React.useMemo(() => {
    const series = buildBalanceChartData(
      account,
      userDateFormat,
      plugin,
      getTradingDayKey,
      propChallengeOverlay,
      trades
    );
    
    
    
    if (!propChallengeOverlay) return series;
    const { startMs, endMs } = propChallengeOverlay;
    return series.filter((point) => {
      const at = new Date(point.rawDate).getTime();
      return (
        (startMs === undefined || at >= startOfLocalDay(startMs)) &&
        (endMs === undefined || at <= endMs)
      );
    });
  }, [
    account,
    trades,
    userDateFormat,
    plugin,
    getTradingDayKey,
    propChallengeOverlay,
  ]);

  const displayChartData = React.useMemo(
    () =>
      isBalanceMasked
        ? chartData.map((point) => ({
            ...point,
            displayBalance: 1,
            displayDrawdownLevel:
              point.drawdownLevel === undefined ? undefined : 1,
          }))
        : chartData.map((point) => ({
            ...point,
            displayBalance: point.balance,
            displayDrawdownLevel: point.drawdownLevel,
          })),
    [chartData, isBalanceMasked]
  );

  const chartParams = React.useMemo(
    () =>
      calculateBalanceChartParams(
        displayChartData,
        account,
        isBalanceMasked,
        propChallengeOverlay
      ),
    [displayChartData, account, isBalanceMasked, propChallengeOverlay]
  );

  const renderedChartData = React.useMemo(
    () =>
      clampDrawdownSeriesToDomain(displayChartData, chartParams?.domain?.[0]),
    [displayChartData, chartParams]
  );

  const balanceAxisPrecision = React.useMemo(
    () => resolveBalanceAxisPrecision(chartParams?.ticks),
    [chartParams]
  );

  const formatBalanceAxisTick = React.useCallback(
    (value: number): string =>
      formatValue({
        kind: 'balance',
        value,
        currencyCode: currency,
        precision: balanceAxisPrecision,
      }),
    [balanceAxisPrecision, currency, formatValue]
  );

  
  const yAxisWidth = React.useMemo(() => {
    if (!chartParams || !chartParams.ticks) return 50;
    return calculateYAxisWidth(chartParams.ticks, formatBalanceAxisTick);
  }, [chartParams, formatBalanceAxisTick]);

  return {
    propChallengeOverlay,
    chartData,
    displayChartData,
    renderedChartData,
    chartParams,
    formatBalanceAxisTick,
    yAxisWidth,
    defaultRiskAmount: plugin?.settings?.trade?.defaultRiskAmount ?? 0,
  };
}

const resolveChartCurrency = (
  currencyOverride: string | undefined,
  accountCurrency: CurrencyCode | undefined,
  globalCurrency: CurrencyCode
): CurrencyCode =>
  currencyOverride
    ? parseCuratedCurrencyCode(currencyOverride)
    : accountCurrency || globalCurrency;

const cashflowStrokeColors = (isMoneyMasked: boolean) =>
  isMoneyMasked
    ? {
        depositStrokeColor: 'var(--text-muted)',
        withdrawalStrokeColor: 'var(--text-muted)',
      }
    : {
        depositStrokeColor: 'var(--interactive-accent)',
        withdrawalStrokeColor: 'var(--text-warning, gold)',
      };

const showsDrawdownSeries = (
  propChallengeOverlay: ProjectedPropChallengeRules | undefined,
  drawdownType: DrawdownType
): boolean =>
  propChallengeOverlay
    ? propChallengeOverlay.drawdown !== undefined
    : drawdownType !== DrawdownType.NONE;

const ProfitTargetReferenceLine: React.FC<{
  value: number;
  isBalanceMasked: boolean;
}> = ({ value, isBalanceMasked }) => (
  <ReferenceLine
    y={value}
    stroke={
      isBalanceMasked ? 'var(--text-muted)' : 'var(--text-success, #00b300)'
    }
    strokeOpacity={isBalanceMasked ? 0.5 : 1.0}
    strokeDasharray="5 5"
    strokeWidth={2}
    className={
      isBalanceMasked
        ? 'profit-target-line profit-target-line--masked'
        : 'profit-target-line'
    }
    label={
      isBalanceMasked
        ? undefined
        : {
            value: 'Profit Target',
            fill: 'var(--text-success, #00b300)',
            fontSize: 12,
            position: 'insideTopLeft',
          }
    }
  />
);

export const AccountBalanceChart: React.FC<AccountBalanceChartProps> = ({
  account,
  trades,
  height = 250,
  currencyOverride,
  selectedPhaseId,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartIdRef = React.useRef(
    `account-balance-chart-${++accountBalanceChartIdCounter}`
  );
  const balanceGradientId = `${chartIdRef.current}-balance-gradient`;
  const balanceStrokeGradientId = `${chartIdRef.current}-balance-stroke-gradient`;
  const { currency: globalCurrency } = useCurrency();
  
  const currency = resolveChartCurrency(
    currencyOverride,
    account.currency,
    globalCurrency
  );

  const transactionSignature = (account.transactions || [])
    .map(
      (transaction) => `${transaction.date.toISOString()}:${transaction.amount}`
    )
    .join('|');
  const [dotsReadyForSignature, setDotsReadyForSignature] = useState('');
  const isChartAnimationActive = useChartAnimationActive();

  const { shouldMask } = useDisplayFormatter();
  const isBalanceMasked = shouldMask('balance');
  const isPnlMasked = shouldMask('pnl');
  const isMoneyMasked = shouldMask('money');
  const isDrawdownMasked = shouldMask('drawdown');
  const { depositStrokeColor, withdrawalStrokeColor } =
    cashflowStrokeColors(isMoneyMasked);

  const {
    propChallengeOverlay,
    chartData,
    displayChartData,
    renderedChartData,
    chartParams,
    formatBalanceAxisTick,
    yAxisWidth,
    defaultRiskAmount,
  } = useAccountBalanceChartModel(
    account,
    trades,
    currency,
    isBalanceMasked,
    selectedPhaseId
  );
  const hasDrawdownSeries = showsDrawdownSeries(
    propChallengeOverlay,
    account.drawdownType
  );
  const animateSeries =
    isChartAnimationActive && shouldAnimateSeries(renderedChartData.length);
  
  const showDots =
    !animateSeries || dotsReadyForSignature === transactionSignature;
  
  
  const handleBalanceAnimationEnd = React.useCallback(
    () => setDotsReadyForSignature(transactionSignature),
    [transactionSignature]
  );

  
  if (chartData.length === 0) {
    return <AccountBalanceChartEmpty height={height} />;
  }

  
  const {
    domain,
    ticks,
    profitTargetValue,
    profitTargetOffScaleBy,
    drawdownFloorValue,
    drawdownFloorOffScaleBy,
    showZeroLine,
  } = chartParams!;
  
  
  
  
  const balanceBaseline =
    propChallengeOverlay?.startingBalance ?? account.initialBalance;
  const balanceColorBaseline = isBalanceMasked ? 1 : balanceBaseline;
  const balanceTransitionOffsets = calculateBalanceColorTransitionOffsets(
    displayChartData,
    balanceColorBaseline
  );

  return (
    <ChartBase
      height={height}
      width="100%"
      className="account-balance-chart"
      chartRef={chartRef}
    >
      <ComposedChart
        data={renderedChartData}
        margin={{ top: 4, right: 15, left: 10, bottom: 12 }}
      >
        <AccountBalanceChartDefs
          balanceGradientId={balanceGradientId}
          balanceStrokeGradientId={balanceStrokeGradientId}
          balanceAreaTransitionOffset={balanceTransitionOffsets.area}
          balanceStrokeTransitionOffset={balanceTransitionOffsets.stroke}
          isBalanceMasked={isBalanceMasked}
          isDrawdownMasked={isDrawdownMasked}
        />
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          verticalCoordinatesGenerator={skipVerticalGridCoordinates}
          stroke="var(--background-modifier-border)"
          strokeOpacity={0.5}
        />
        <XAxis
          dataKey="date"
          height={18}
          tickMargin={4} 
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatBalanceAxisTick}
          domain={domain}
          allowDataOverflow={false}
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tickMargin={5}
          ticks={ticks}
        />
        <RechartsPortalTooltip
          chartRef={chartRef}
          cursor={{
            fill: 'var(--interactive-hover)',
            fillOpacity: 0.1,
            strokeOpacity: 0.3,
            strokeWidth: 1,
            stroke: 'var(--interactive-accent)',
          }}
        >
          {(tooltipProps) => (
            <CustomTooltip
              {...(tooltipProps as TooltipProps<number, string>)}
              currency={currency}
              defaultRiskAmount={defaultRiskAmount}
            />
          )}
        </RechartsPortalTooltip>

        
        {showZeroLine && (
          <ReferenceLine
            y={0}
            stroke="var(--text-normal)"
            strokeOpacity={0.5}
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        )}

        
        {balanceBaseline !== 0 && (
          <ReferenceLine
            y={balanceBaseline}
            stroke="var(--text-muted)"
            strokeOpacity={0.7}
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        )}

        
        {profitTargetValue !== undefined &&
          profitTargetOffScaleBy === undefined && (
            <ProfitTargetReferenceLine
              value={profitTargetValue}
              isBalanceMasked={isBalanceMasked}
            />
          )}

        
        <Area
          type="monotone"
          dataKey="displayBalance"
          stroke="none"
          fill={`url(#${balanceGradientId})`}
          fillOpacity={0.95}
          dot={false}
          activeDot={false}
          baseValue={balanceColorBaseline}
          isAnimationActive={animateSeries}
          
        />

        
        {hasDrawdownSeries && (
          <Line
            type="stepAfter"
            dataKey="displayDrawdownLevel"
            stroke={
              isDrawdownMasked ? 'var(--text-muted)' : 'var(--text-error)'
            }
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={false}
            isAnimationActive={animateSeries}
            name="Drawdown Level"
          />
        )}

        
        <AccountBalanceOffScaleLevels
          domain={domain}
          drawdownFloorValue={drawdownFloorValue}
          drawdownFloorOffScaleBy={drawdownFloorOffScaleBy}
          profitTargetValue={profitTargetValue}
          profitTargetOffScaleBy={profitTargetOffScaleBy}
          formatValue={formatBalanceAxisTick}
        />

        
        {hasDrawdownSeries && (
          <Area
            type="monotone"
            dataKey="displayDrawdownLevel"
            stroke="none"
            fill="url(#drawdownGradient)"
            fillOpacity={1}
            isAnimationActive={animateSeries}
          />
        )}

        <AccountBalanceChartSeries
          balanceStrokeGradientId={balanceStrokeGradientId}
          isAnimationActive={animateSeries}
          showDots={showDots}
          isPnlMasked={isPnlMasked}
          depositStrokeColor={depositStrokeColor}
          withdrawalStrokeColor={withdrawalStrokeColor}
          onAnimationEnd={handleBalanceAnimationEnd}
        />
      </ComposedChart>
    </ChartBase>
  );
};
