

import React, { useState } from 'react';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  formatDateDisplay,
  getUserDateFormat,
  safeParseDateValue,
} from '../../../utils/dateUtils';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import { usePlugin } from '../../../hooks';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  generateNiceAxis,
  calculateYAxisWidth,
} from '../../../utils/chartUtils';
import {
  AccountData,
  AccountTransaction,
  ManualDrawdownSnapshot,
  TransactionType,
  ProfitTargetType,
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
import { hasLiveBalanceAdjustment } from '../../../services/account/liveBalanceAdjustment';

const POSITIVE_BALANCE_COLOR = 'var(--chart-positive, #43a047)';
const NEGATIVE_BALANCE_COLOR = 'var(--chart-negative, #e53935)';
let accountBalanceChartIdCounter = 0;


interface BalanceChartDataPoint {
  date: string;
  rawDate: Date;
  balance: number;
  drawdownLevel?: number;
  transaction?: AccountTransaction;
  isDeposit?: boolean;
  isWithdrawal?: boolean;
  isTrade?: boolean;
  
  isConsolidated?: boolean;
  tradeCount?: number;
  dailyPnL?: number;
  hasEvents?: boolean; 
  dayTransactions?: AccountTransaction[]; 
  isInitialBalance?: boolean; 
}


interface AccountBalanceChartProps {
  account: AccountData;
  height?: number;
  
  currencyOverride?: string;
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
                {data.dayTransactions
                  .filter(
                    (t) =>
                      t.type === TransactionType.DEPOSIT ||
                      t.type === TransactionType.WITHDRAWAL
                  )
                  .filter(
                    (t) =>
                      !(
                        t.type === TransactionType.DEPOSIT &&
                        t.description === 'Initial deposit'
                      )
                  )
                  .map((transaction) => {
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

                    return (
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
                      </div>
                    );
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



const buildBalanceChartData = (
  account: AccountData,
  userDateFormat: string,
  plugin: ReturnType<typeof usePlugin>,
  getTradingDayKey: (date: Date) => string
): BalanceChartDataPoint[] => {
  
  if (!account.transactions || account.transactions.length === 0) {
    return [];
  }

  
  const sortedTransactions = [...account.transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  
  
  let initialDrawdownLevel = account.initialBalance - account.drawdownAmount;
  if (
    account.drawdownType === DrawdownType.MANUAL &&
    account.allDrawdownSnapshots &&
    account.allDrawdownSnapshots.length > 0
  ) {
    
    let applicableSnapshot: ManualDrawdownSnapshot | undefined;
    let latestSnapshotTime = Number.NEGATIVE_INFINITY;

    for (const snapshot of account.allDrawdownSnapshots) {
      if (!snapshot?.date) continue;

      const parsedDate = safeParseDateValue(snapshot.date);
      if (
        !parsedDate ||
        isNaN(parsedDate.getTime()) ||
        parsedDate > account.createdDate
      ) {
        continue;
      }

      const snapshotTime = parsedDate.getTime();
      if (snapshotTime > latestSnapshotTime) {
        latestSnapshotTime = snapshotTime;
        applicableSnapshot = snapshot;
      }
    }

    if (applicableSnapshot) {
      initialDrawdownLevel = applicableSnapshot.drawdownLimit;
    }
  }

  
  const data: BalanceChartDataPoint[] = [];

  
  
  if (account.createdDate) {
    
    const createdDate =
      account.createdDate instanceof Date
        ? account.createdDate
        : new Date(account.createdDate);

    
    if (!isNaN(createdDate.getTime())) {
      const creationDateString = createdDate.toISOString().split('T')[0];
      const hasTransactionOnCreationDate = sortedTransactions.some(
        (transaction) => {
          
          const transactionDate =
            transaction.date instanceof Date
              ? transaction.date
              : new Date(transaction.date);
          return (
            transactionDate.toISOString().split('T')[0] === creationDateString
          );
        }
      );

      if (!hasTransactionOnCreationDate) {
        data.push({
          date: formatDateDisplay(createdDate, userDateFormat),
          rawDate: createdDate,
          balance: account.initialBalance,
          
          ...(account.drawdownType !== DrawdownType.NONE && {
            drawdownLevel: initialDrawdownLevel,
          }),
        });
      } else {
        
        
        const hasInitialDeposit = sortedTransactions.some(
          (t) =>
            t.type === TransactionType.DEPOSIT &&
            t.description === 'Initial deposit'
        );

        if (hasInitialDeposit) {
          
          const initialBalanceDate = new Date(createdDate);
          initialBalanceDate.setHours(0, 0, 0, 0); 

          data.push({
            date: formatDateDisplay(initialBalanceDate, userDateFormat),
            rawDate: initialBalanceDate,
            balance: account.initialBalance,
            isInitialBalance: true, 
            
            ...(account.drawdownType !== DrawdownType.NONE && {
              drawdownLevel: initialDrawdownLevel,
            }),
          });
        }
      }
    }
  }

  
  const transactionsByDay = new Map<
    string,
    {
      dayEnd: Date;
      transactions: AccountTransaction[];
      finalBalance: number;
      tradeCount: number;
      dailyPnL: number;
      hasEvents: boolean;
    }
  >();

  
  
  let peakBalance = account.initialBalance;
  let currentDrawdownLevel = initialDrawdownLevel;

  
  
  const nonCostTransactions = sortedTransactions.filter(
    (t) => t.type !== TransactionType.COST
  );
  nonCostTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const tradingDay = getTradingDay(transactionDate, plugin);
    
    const tradingDayKey = getTradingDayKey(tradingDay);

    
    if (!transactionsByDay.has(tradingDayKey)) {
      transactionsByDay.set(tradingDayKey, {
        dayEnd: tradingDay,
        transactions: [],
        finalBalance: 0,
        tradeCount: 0,
        dailyPnL: 0,
        hasEvents: false,
      });
    }

    const dayRecord = transactionsByDay.get(tradingDayKey)!;

    
    dayRecord.transactions.push(transaction);

    
    dayRecord.finalBalance = transaction.balanceAfter;

    
    if (transaction.type === TransactionType.TRADE) {
      dayRecord.tradeCount++;
      dayRecord.dailyPnL += transaction.amount;
    }

    
    if (
      transaction.type === TransactionType.DEPOSIT ||
      transaction.type === TransactionType.WITHDRAWAL
    ) {
      dayRecord.hasEvents = true;
    }

    
    if (transactionDate > dayRecord.dayEnd) {
      dayRecord.dayEnd = transactionDate;
    }
  });

  
  const tradingDays = Array.from(transactionsByDay.keys()).sort();

  
  tradingDays.forEach((dayKey) => {
    const dayRecord = transactionsByDay.get(dayKey)!;
    
    
    
    const dayDate = new Date(dayRecord.dayEnd);

    
    let drawdownLevel = initialDrawdownLevel;

    if (account.drawdownType === DrawdownType.EOD_TRAILING) {
      
      if (dayRecord.finalBalance > peakBalance) {
        peakBalance = dayRecord.finalBalance;
      }

      
      
      
      
      
      const newDrawdownLevel = Math.min(
        account.initialBalance, 
        Math.max(
          peakBalance - account.drawdownAmount, 
          currentDrawdownLevel 
        )
      );

      
      currentDrawdownLevel = newDrawdownLevel;
      drawdownLevel = newDrawdownLevel;
    } else if (
      account.drawdownType === DrawdownType.MANUAL &&
      account.allDrawdownSnapshots &&
      account.allDrawdownSnapshots.length > 0
    ) {
      
      const dayDate = dayRecord.dayEnd; 

      let applicableSnapshot: ManualDrawdownSnapshot | undefined;
      let latestSnapshotTime = Number.NEGATIVE_INFINITY;

      for (const snapshot of account.allDrawdownSnapshots) {
        if (!snapshot?.date) continue;

        const parsedDate = safeParseDateValue(snapshot.date);
        if (
          !parsedDate ||
          isNaN(parsedDate.getTime()) ||
          parsedDate > dayDate
        ) {
          continue;
        }

        const snapshotTime = parsedDate.getTime();
        if (snapshotTime > latestSnapshotTime) {
          latestSnapshotTime = snapshotTime;
          applicableSnapshot = snapshot;
        }
      }

      if (applicableSnapshot) {
        drawdownLevel = applicableSnapshot.drawdownLimit;
      }
    }

    
    const hasDeposits = dayRecord.transactions.some(
      (t: AccountTransaction) =>
        t.type === TransactionType.DEPOSIT &&
        t.amount > 0 &&
        t.description !== 'Initial deposit'
    );
    const hasWithdrawals = dayRecord.transactions.some(
      (t: AccountTransaction) =>
        t.type === TransactionType.WITHDRAWAL ||
        (t.type === TransactionType.DEPOSIT && t.amount < 0)
    );

    
    data.push({
      date: formatDateDisplay(dayDate, userDateFormat),
      rawDate: dayDate,
      balance: dayRecord.finalBalance,
      
      ...(account.drawdownType !== DrawdownType.NONE && {
        drawdownLevel: drawdownLevel,
      }),
      isConsolidated: true,
      tradeCount: dayRecord.tradeCount,
      dailyPnL: dayRecord.dailyPnL,
      hasEvents: dayRecord.hasEvents,
      isTrade: dayRecord.tradeCount > 0,
      dayTransactions: dayRecord.transactions, 
      
      isDeposit: hasDeposits,
      isWithdrawal: hasWithdrawals,
    });
  });

  
  
  
  

  
  
  
  const finalData = data
    .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
    .filter((point, index, sortedData) => {
      if (!point.isInitialBalance) return true;

      const nextPoint = sortedData[index + 1];
      return !(
        nextPoint &&
        nextPoint.date === point.date &&
        nextPoint.balance === point.balance
      );
    });

  if (hasLiveBalanceAdjustment(account.liveBalanceAdjustment)) {
    const lastPoint = finalData[finalData.length - 1];
    const needsLiveBalancePoint =
      !lastPoint || lastPoint.balance !== account.currentBalance;

    if (needsLiveBalancePoint) {
      const liveBalanceDate = new Date();
      liveBalanceDate.setHours(23, 59, 59, 999);
      finalData.push({
        date: formatDateDisplay(liveBalanceDate, userDateFormat),
        rawDate: liveBalanceDate,
        balance: account.currentBalance,
        drawdownLevel: lastPoint?.drawdownLevel,
      });
    }
  }

  return finalData.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
};

const calculateBalanceChartParams = (
  displayChartData: Array<
    BalanceChartDataPoint & {
      displayBalance: number;
      displayDrawdownLevel?: number;
    }
  >,
  account: AccountData,
  isBalanceMasked: boolean
) => {
  if (displayChartData.length === 0) {
    return null;
  }

  if (isBalanceMasked) {
    return {
      domain: [0, 2] as [number, number],
      ticks: [1],
      profitTargetValue:
        account.hasProfitTarget && account.profitTarget > 0 ? 1 : undefined,
      showZeroLine: false,
    };
  }

  
  const balanceValues = displayChartData.map((point) => point.displayBalance);
  const minBalanceValue = Math.min(...balanceValues);
  const maxBalanceValue = Math.max(...balanceValues);
  let minValue = minBalanceValue;
  let maxValue = maxBalanceValue;

  
  if (account.hasProfitTarget && account.profitTarget > 0) {
    const targetAmount =
      account.profitTargetType === ProfitTargetType.PERCENTAGE
        ? (account.initialBalance * account.profitTarget) / 100
        : account.profitTarget;

    
    const totalTarget = account.initialBalance + targetAmount;
    maxValue = Math.max(maxValue, totalTarget);
  }
  const meaningfulMaxValue = maxValue;

  
  
  const drawdownLevels = displayChartData
    .map((point) => point.displayDrawdownLevel)
    .filter((level): level is number => level !== undefined);
  const drawdownLevel =
    drawdownLevels.length > 0 ? Math.min(...drawdownLevels) : undefined;

  const dataMinValue = Math.min(minValue, drawdownLevel ?? minValue);

  
  const dataRange = maxValue - dataMinValue;

  
  maxValue = maxValue + dataRange * 0.05;

  if (drawdownLevel !== undefined && drawdownLevel < minValue) {
    minValue = drawdownLevel;
  } else {
    
    minValue = minValue - dataRange * 0.1;
  }

  
  
  if (dataMinValue >= 0) {
    minValue = Math.max(0, minValue);
  }

  
  
  
  const balanceHeadroomRange = maxBalanceValue - minValue;
  if (balanceHeadroomRange > 0) {
    maxValue = Math.max(
      maxValue,
      maxBalanceValue + balanceHeadroomRange * 0.35
    );
  }

  
  if (minValue > 0 && minValue < maxValue * 0.05) {
    minValue = 0;
  }

  
  const profitTargetValue =
    account.hasProfitTarget && account.profitTarget > 0
      ? account.profitTargetType === ProfitTargetType.PERCENTAGE
        ? account.initialBalance +
          (account.initialBalance * account.profitTarget) / 100
        : account.initialBalance + account.profitTarget
      : undefined;

  
  
  
  let { domain, ticks } = generateNiceAxis(minValue, maxValue, 6, false, false);

  while (ticks.length > 2 && ticks[ticks.length - 2] >= meaningfulMaxValue) {
    ticks = ticks.slice(0, -1);
    domain = [domain[0], ticks[ticks.length - 1]];
  }

  if (dataMinValue >= 0 && domain[0] < 0) {
    domain = [0, domain[1]];
    ticks = ticks.filter((tick) => tick >= 0);
    if (!ticks.includes(0)) {
      ticks = [0, ...ticks];
    }
  }

  if (
    drawdownLevel !== undefined &&
    minBalanceValue >= drawdownLevel &&
    domain[0] < drawdownLevel
  ) {
    domain = [drawdownLevel, domain[1]];
    ticks = ticks.filter((tick) => tick >= drawdownLevel);
    if (!ticks.includes(drawdownLevel)) {
      ticks = [drawdownLevel, ...ticks];
    }
  }

  const baselineFloor = isBalanceMasked ? undefined : account.initialBalance;
  if (
    baselineFloor !== undefined &&
    minBalanceValue >= baselineFloor &&
    !(drawdownLevel !== undefined && drawdownLevel < baselineFloor) &&
    domain[0] < baselineFloor
  ) {
    domain = [baselineFloor, domain[1]];
    ticks = ticks.filter((tick) => tick >= baselineFloor);
    if (!ticks.includes(baselineFloor)) {
      ticks = [baselineFloor, ...ticks];
    }
  }

  return {
    domain,
    ticks,
    profitTargetValue,
    showZeroLine: domain[0] < 0 && domain[1] > 0,
  };
};

interface BalanceDotContext {
  showDots: boolean;
  isPnlMasked: boolean;
  depositStrokeColor: string;
  withdrawalStrokeColor: string;
}

const hiddenDot = <circle cx={0} cy={0} r={0} opacity={0} />;

const getTradePointColor = (
  payload: any,
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

const renderBalanceDot = (props: any, context: BalanceDotContext) => {
  const { cx, cy, payload } = props;
  if (!payload || !context.showDots) return hiddenDot;
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

const renderActiveBalanceDot = (props: any, context: BalanceDotContext) => {
  const { cx, cy, payload } = props;
  if (!payload) return hiddenDot;
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

const AccountBalanceChartDefs: React.FC<{
  balanceGradientId: string;
  balanceStrokeGradientId: string;
  balanceAreaTransitionOffset: number;
  balanceStrokeTransitionOffset: number;
  isBalanceMasked: boolean;
  isDrawdownMasked: boolean;
}> = ({
  balanceGradientId,
  balanceStrokeGradientId,
  balanceAreaTransitionOffset,
  balanceStrokeTransitionOffset,
  isBalanceMasked,
  isDrawdownMasked,
}) => {
  const positiveColor = isBalanceMasked
    ? 'var(--text-muted)'
    : POSITIVE_BALANCE_COLOR;
  const negativeColor = isBalanceMasked
    ? 'var(--text-muted)'
    : NEGATIVE_BALANCE_COLOR;

  return (
    <defs>
      <linearGradient id={balanceGradientId} x1="0" y1="0" x2="0" y2="1">
        {balanceAreaTransitionOffset <= 0.1 ? (
          <>
            <stop offset="0%" stopColor={negativeColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={negativeColor} stopOpacity={0.1} />
          </>
        ) : balanceAreaTransitionOffset >= 99.9 ? (
          <>
            <stop offset="0%" stopColor={positiveColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={positiveColor} stopOpacity={0.1} />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor={positiveColor} stopOpacity={0.4} />
            <stop
              offset={`${balanceAreaTransitionOffset}%`}
              stopColor={positiveColor}
              stopOpacity={0.1}
            />
            <stop
              offset={`${balanceAreaTransitionOffset}%`}
              stopColor={negativeColor}
              stopOpacity={0.1}
            />
            <stop offset="100%" stopColor={negativeColor} stopOpacity={0.4} />
          </>
        )}
      </linearGradient>
      <linearGradient id={balanceStrokeGradientId} x1="0" y1="0" x2="0" y2="1">
        {balanceStrokeTransitionOffset <= 0.1 ? (
          <>
            <stop offset="0%" stopColor={negativeColor} />
            <stop offset="100%" stopColor={negativeColor} />
          </>
        ) : balanceStrokeTransitionOffset >= 99.9 ? (
          <>
            <stop offset="0%" stopColor={positiveColor} />
            <stop offset="100%" stopColor={positiveColor} />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor={positiveColor} />
            <stop
              offset={`${Math.max(0.1, balanceStrokeTransitionOffset - 0.1)}%`}
              stopColor={positiveColor}
            />
            <stop
              offset={`${Math.min(99.9, balanceStrokeTransitionOffset + 0.1)}%`}
              stopColor={negativeColor}
            />
            <stop offset="100%" stopColor={negativeColor} />
          </>
        )}
      </linearGradient>
      <filter id="balanceShadow" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
      </filter>
      <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="0%"
          stopColor={
            isDrawdownMasked ? 'var(--text-muted)' : 'var(--text-error)'
          }
          stopOpacity={0.2}
        />
        <stop
          offset="100%"
          stopColor={
            isDrawdownMasked ? 'var(--text-muted)' : 'var(--text-error)'
          }
          stopOpacity={0.5}
        />
      </linearGradient>
    </defs>
  );
};

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
    dot={(props: any) =>
      renderBalanceDot(props, {
        showDots,
        isPnlMasked,
        depositStrokeColor,
        withdrawalStrokeColor,
      })
    }
    activeDot={(props: any) =>
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

export const AccountBalanceChart: React.FC<AccountBalanceChartProps> = ({
  account,
  height = 250,
  currencyOverride,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartIdRef = React.useRef(
    `account-balance-chart-${++accountBalanceChartIdCounter}`
  );
  const balanceGradientId = `${chartIdRef.current}-balance-gradient`;
  const balanceStrokeGradientId = `${chartIdRef.current}-balance-stroke-gradient`;
  const { currency: globalCurrency } = useCurrency();
  
  const currency =
    (currencyOverride as typeof globalCurrency) ||
    account.currency ||
    globalCurrency;

  const transactionSignature = (account.transactions || [])
    .map((transaction) => `${transaction.date}:${transaction.amount}`)
    .join('|');
  const [dotsReadyForSignature, setDotsReadyForSignature] = useState('');
  const showDots = dotsReadyForSignature === transactionSignature;

  
  const userDateFormat = React.useMemo(() => getUserDateFormat(), []);
  const plugin = usePlugin();

  
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount ?? 0;
  const { formatValue, shouldMask } = useDisplayFormatter();
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

  
  const getTradingDayKey = React.useCallback((date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

  const chartData = React.useMemo(
    () =>
      buildBalanceChartData(account, userDateFormat, plugin, getTradingDayKey),
    [account, userDateFormat, plugin, getTradingDayKey]
  );

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
      calculateBalanceChartParams(displayChartData, account, isBalanceMasked),
    [displayChartData, account, isBalanceMasked]
  );

  const balanceAxisPrecision = React.useMemo(() => {
    if (!chartParams?.ticks || chartParams.ticks.length < 2) return 0;

    const tickSpacing = Math.min(
      ...chartParams.ticks
        .slice(1)
        .map((tick, index) => Math.abs(tick - chartParams.ticks[index]))
        .filter((spacing) => spacing > 0)
    );

    return Number.isFinite(tickSpacing) && tickSpacing >= 1 ? 0 : undefined;
  }, [chartParams]);

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

  
  if (chartData.length === 0) {
    return <AccountBalanceChartEmpty height={height} />;
  }

  
  const { domain, ticks, profitTargetValue, showZeroLine } = chartParams!;
  const balanceColorBaseline = isBalanceMasked ? 1 : account.initialBalance;
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
        data={displayChartData}
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
              {...(tooltipProps as any)}
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

        
        {account.initialBalance !== 0 && (
          <ReferenceLine
            y={account.initialBalance}
            stroke="var(--text-muted)"
            strokeOpacity={0.7}
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        )}

        
        {profitTargetValue && (
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

        
        {account.drawdownType !== DrawdownType.NONE && (
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

        
        {account.drawdownType !== DrawdownType.NONE && (
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
