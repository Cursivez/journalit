

import React, { useState } from 'react';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getUserDateFormat } from '../../../utils/dateUtils';
import {
  CurrencyCode,
  parseCuratedCurrencyCode,
} from '../../../utils/currencyConfig';
import { usePlugin } from '../../../hooks/usePlugin';
import { projectCurrentPropChallengeRules } from '../../../services/propChallenge/PropChallengeRuleProjection';
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
import {
  AccountData,
  TransactionType,
  DrawdownType,
} from '../../../services/account/types';
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

let accountBalanceChartIdCounter = 0;



interface AccountBalanceChartProps {
  account: AccountData;
  trades: readonly AccountTradeData[];
  height?: number;
  
  currencyOverride?: string;
  
  selectedPhaseId?: string | null;
}


interface CustomTooltipContentProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: BalanceChartDataPoint;
  }>;
  currency: CurrencyCode;
  defaultRiskAmount?: number;
}


const formatTradeDescription = (description: string | undefined): string => {
  if (!description) return '-';

  
  if (!description.startsWith('Trade P&L:')) return description;

  
  const regex = /Trade P&L: .+\/([A-Z0-9]+)-(\d{6})-([^.]+)\.md/;
  const match = description.match(regex);

  if (!match || match.length < 4) return description;

  const [, ticker, dateCode, tradeNumber] = match;

  
  try {
    
    const year = '20' + dateCode.substring(0, 2); 
    const month = dateCode.substring(2, 4);
    const day = dateCode.substring(4, 6);

    
    const date = new Date(`${year}-${month}-${day}`);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    
    return `${ticker} ${tradeNumber} (${formattedDate})`;
  } catch {
    
    return `${ticker} ${tradeNumber}`;
  }
};

const CustomTooltip: React.FC<CustomTooltipContentProps> = React.memo(
  ({ active, payload, currency, defaultRiskAmount }) => {
    const { formatValue, shouldMask } = useDisplayFormatter();

    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const isPnlMasked = shouldMask('pnl');
    const isMoneyMasked = shouldMask('money');
    const isDrawdownMasked = shouldMask('drawdown');

    const formatChartValue = (
      kind: 'balance' | 'pnl' | 'money' | 'drawdown',
      value: number,
      rMultiple?: number
    ): string =>
      formatValue({
        kind,
        value,
        currencyCode: currency,
        rMultiple,
      });

    return (
      <div className="journalit-account-chart-tooltip">
        <div className="journalit-account-chart-tooltip-date">{data.date}</div>
        <div className="journalit-account-chart-tooltip-value">
          Balance: {formatChartValue('balance', data.balance)}
        </div>

        
        {data.isConsolidated && (
          <div className="journalit-account-chart-tooltip-section">
            {data.tradeCount && data.tradeCount > 0 && (
              <div className="journalit-account-chart-tooltip-row journalit-account-chart-tooltip-row--spaced">
                <span className="journalit-account-chart-tooltip-label">
                  Trades:
                </span>{' '}
                {data.tradeCount}
              </div>
            )}
            {data.dailyPnL !== undefined && (
              <div
                className={`journalit-account-chart-tooltip-row journalit-account-chart-tooltip-row--emphasis ${
                  isPnlMasked
                    ? ''
                    : data.dailyPnL >= 0
                      ? 'journalit-account-chart-tooltip-row--positive'
                      : 'journalit-account-chart-tooltip-row--negative'
                }`}
              >
                Day P&L:{' '}
                {formatChartValue(
                  'pnl',
                  data.dailyPnL,
                  defaultRiskAmount && defaultRiskAmount > 0
                    ? data.dailyPnL / defaultRiskAmount
                    : undefined
                )}
              </div>
            )}
            {data.hasEvents && data.dayTransactions && (
              <div className="journalit-account-chart-tooltip-list">
                {data.dayTransactions.flatMap((transaction) => {
                  if (
                    transaction.type !== TransactionType.DEPOSIT &&
                    transaction.type !== TransactionType.WITHDRAWAL
                  ) {
                    return [];
                  }
                  if (
                    transaction.type === TransactionType.DEPOSIT &&
                    transaction.description === 'Initial deposit'
                  ) {
                    return [];
                  }

                  const isDeposit =
                    transaction.type === TransactionType.DEPOSIT &&
                    transaction.amount > 0;
                  const isWithdrawal =
                    transaction.type === TransactionType.WITHDRAWAL ||
                    (transaction.type === TransactionType.DEPOSIT &&
                      transaction.amount < 0);

                  const transactionClass = isMoneyMasked
                    ? 'journalit-account-chart-tooltip-row--neutral'
                    : isDeposit
                      ? 'journalit-account-chart-tooltip-row--deposit'
                      : isWithdrawal
                        ? 'journalit-account-chart-tooltip-row--withdrawal'
                        : 'journalit-account-chart-tooltip-row--neutral';

                  return [
                    <div
                      key={transaction.id}
                      className={`journalit-account-chart-tooltip-row journalit-account-chart-tooltip-row--compact ${transactionClass}`}
                    >
                      {isDeposit &&
                        `• ${isMoneyMasked ? 'Cashflow' : 'Deposit'}: ${formatChartValue('money', transaction.amount)}`}
                      {isWithdrawal &&
                        `• ${isMoneyMasked ? 'Cashflow' : 'Withdrawal'}: ${formatChartValue('money', Math.abs(transaction.amount))}`}
                      {transaction.description &&
                        transaction.description !== 'Manual deposit' &&
                        transaction.description !== 'Manual withdrawal' && (
                          <span className="journalit-account-chart-tooltip-muted">
                            {' - ' + transaction.description}
                          </span>
                        )}
                    </div>,
                  ];
                })}
              </div>
            )}
          </div>
        )}

        
        {data.transaction && (
          <div className="journalit-account-chart-tooltip-section">
            {data.isDeposit && (
              <div
                className={`journalit-account-chart-tooltip-row ${
                  isMoneyMasked
                    ? 'journalit-account-chart-tooltip-row--neutral'
                    : 'journalit-account-chart-tooltip-row--deposit'
                }`}
              >
                {isMoneyMasked ? 'Cashflow' : 'Deposit'}:{' '}
                {formatChartValue('money', data.transaction.amount)}
              </div>
            )}
            {data.isWithdrawal && (
              <div
                className={`journalit-account-chart-tooltip-row ${
                  isMoneyMasked
                    ? 'journalit-account-chart-tooltip-row--neutral'
                    : 'journalit-account-chart-tooltip-row--withdrawal'
                }`}
              >
                {isMoneyMasked ? 'Cashflow' : 'Withdrawal'}:{' '}
                {formatChartValue('money', Math.abs(data.transaction.amount))}
              </div>
            )}
            {data.isTrade && !data.isConsolidated && (
              <div
                className={`journalit-account-chart-tooltip-row ${
                  isPnlMasked
                    ? ''
                    : data.transaction && data.transaction.amount >= 0
                      ? 'journalit-account-chart-tooltip-row--positive'
                      : 'journalit-account-chart-tooltip-row--negative'
                }`}
              >
                
                {formatTradeDescription(data.transaction.description)}:{' '}
                {formatChartValue(
                  'pnl',
                  data.transaction.amount,
                  defaultRiskAmount && defaultRiskAmount > 0
                    ? data.transaction.amount / defaultRiskAmount
                    : undefined
                )}
              </div>
            )}
            
            {data.transaction.description && !data.isTrade && (
              <div className="journalit-account-chart-tooltip-description">
                {data.transaction.description}
              </div>
            )}
          </div>
        )}

        {data.drawdownLevel !== undefined && (
          <div
            className={`journalit-account-chart-tooltip-drawdown ${
              isDrawdownMasked
                ? 'journalit-account-chart-tooltip-drawdown--masked'
                : ''
            }`}
          >
            Drawdown Level: {formatChartValue('drawdown', data.drawdownLevel)}
          </div>
        )}
      </div>
    );
  }
);
CustomTooltip.displayName = 'AccountBalanceChartTooltip';



interface BalanceDotContext {
  showDots: boolean;
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
  if (cx === undefined || cy === undefined || !payload || !context.showDots)
    return hiddenDot;
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
  showDots: boolean;
  isPnlMasked: boolean;
  depositStrokeColor: string;
  withdrawalStrokeColor: string;
  transactionSignature: string;
  onDotsReady: (signature: string) => void;
}

const AccountBalanceChartSeries: React.FC<AccountBalanceChartSeriesProps> = ({
  balanceStrokeGradientId,
  showDots,
  isPnlMasked,
  depositStrokeColor,
  withdrawalStrokeColor,
  transactionSignature,
  onDotsReady,
}) => (
  <Line
    type="monotone"
    dataKey="displayBalance"
    stroke={`url(#${balanceStrokeGradientId})`}
    strokeWidth={3}
    onAnimationEnd={() => onDotsReady(transactionSignature)}
    dot={(props: BalanceDotProps) =>
      renderBalanceDot(props, {
        showDots,
        isPnlMasked,
        depositStrokeColor,
        withdrawalStrokeColor,
      })
    }
    activeDot={(props: BalanceDotProps) =>
      renderActiveBalanceDot(props, {
        showDots,
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
  
  const currency = currencyOverride
    ? parseCuratedCurrencyCode(currencyOverride)
    : account.currency || globalCurrency;

  const transactionSignature = (account.transactions || [])
    .map(
      (transaction) => `${transaction.date.toISOString()}:${transaction.amount}`
    )
    .join('|');
  const [dotsReadyForSignature, setDotsReadyForSignature] = useState('');
  const showDots = dotsReadyForSignature === transactionSignature;

  const { shouldMask } = useDisplayFormatter();
  const isBalanceMasked = shouldMask('balance');
  const isPnlMasked = shouldMask('pnl');
  const isMoneyMasked = shouldMask('money');
  const isDrawdownMasked = shouldMask('drawdown');
  const depositStrokeColor = isMoneyMasked
    ? 'var(--text-muted)'
    : 'var(--interactive-accent)';
  const withdrawalStrokeColor = isMoneyMasked
    ? 'var(--text-muted)'
    : 'var(--text-warning, gold)';

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
  const hasDrawdownSeries = propChallengeOverlay
    ? propChallengeOverlay.drawdown !== undefined
    : account.drawdownType !== DrawdownType.NONE;

  
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

        
        {profitTargetValue && profitTargetOffScaleBy === undefined && (
          <ReferenceLine
            y={profitTargetValue}
            stroke={
              isBalanceMasked
                ? 'var(--text-muted)'
                : 'var(--text-success, #00b300)'
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
          />
        )}

        <AccountBalanceChartSeries
          balanceStrokeGradientId={balanceStrokeGradientId}
          showDots={showDots}
          isPnlMasked={isPnlMasked}
          depositStrokeColor={depositStrokeColor}
          withdrawalStrokeColor={withdrawalStrokeColor}
          transactionSignature={transactionSignature}
          onDotsReady={setDotsReadyForSignature}
        />
      </ComposedChart>
    </ChartBase>
  );
};
