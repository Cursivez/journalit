
import React from 'react';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { type BalanceChartDataPoint } from './accountBalanceChartModel';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { TransactionType } from '../../../services/account/types';
import { TooltipProps } from 'recharts';


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

type ChartValueKind = 'balance' | 'pnl' | 'money' | 'drawdown';
type FormatChartValue = (
  kind: ChartValueKind,
  value: number,
  rMultiple?: number
) => string;
type DayTransaction = NonNullable<
  BalanceChartDataPoint['dayTransactions']
>[number];

const MANUAL_CASHFLOW_DESCRIPTIONS = new Set([
  'Manual deposit',
  'Manual withdrawal',
]);

const rMultipleOf = (
  amount: number,
  defaultRiskAmount: number | undefined
): number | undefined =>
  defaultRiskAmount && defaultRiskAmount > 0
    ? amount / defaultRiskAmount
    : undefined;

function signedRowClass(isMasked: boolean, value: number): string {
  if (isMasked) return '';
  return value >= 0
    ? 'journalit-account-chart-tooltip-row--positive'
    : 'journalit-account-chart-tooltip-row--negative';
}

function cashflowRowClass(
  isMoneyMasked: boolean,
  isDeposit: boolean,
  isWithdrawal: boolean
): string {
  if (isMoneyMasked) return 'journalit-account-chart-tooltip-row--neutral';
  if (isDeposit) return 'journalit-account-chart-tooltip-row--deposit';
  if (isWithdrawal) return 'journalit-account-chart-tooltip-row--withdrawal';
  return 'journalit-account-chart-tooltip-row--neutral';
}


function isListedCashflow(transaction: DayTransaction): boolean {
  if (transaction.type === TransactionType.WITHDRAWAL) return true;
  return (
    transaction.type === TransactionType.DEPOSIT &&
    transaction.description !== 'Initial deposit'
  );
}

function DayCashflowRow({
  transaction,
  isMoneyMasked,
  formatChartValue,
}: {
  transaction: DayTransaction;
  isMoneyMasked: boolean;
  formatChartValue: FormatChartValue;
}) {
  const isDeposit =
    transaction.type === TransactionType.DEPOSIT && transaction.amount > 0;
  const isWithdrawal =
    transaction.type === TransactionType.WITHDRAWAL ||
    (transaction.type === TransactionType.DEPOSIT && transaction.amount < 0);
  const cashflowLabel = isMoneyMasked ? 'Cashflow' : null;
  const showDescription =
    !!transaction.description &&
    !MANUAL_CASHFLOW_DESCRIPTIONS.has(transaction.description);

  return (
    <div
      className={`journalit-account-chart-tooltip-row journalit-account-chart-tooltip-row--compact ${cashflowRowClass(isMoneyMasked, isDeposit, isWithdrawal)}`}
    >
      {isDeposit &&
        `• ${cashflowLabel ?? 'Deposit'}: ${formatChartValue('money', transaction.amount)}`}
      {isWithdrawal &&
        `• ${cashflowLabel ?? 'Withdrawal'}: ${formatChartValue('money', Math.abs(transaction.amount))}`}
      {showDescription && (
        <span className="journalit-account-chart-tooltip-muted">
          {' - ' + transaction.description}
        </span>
      )}
    </div>
  );
}

function ConsolidatedDaySection({
  data,
  isPnlMasked,
  isMoneyMasked,
  defaultRiskAmount,
  formatChartValue,
}: {
  data: BalanceChartDataPoint;
  isPnlMasked: boolean;
  isMoneyMasked: boolean;
  defaultRiskAmount?: number;
  formatChartValue: FormatChartValue;
}) {
  const cashflows =
    data.hasEvents && data.dayTransactions
      ? data.dayTransactions.filter(isListedCashflow)
      : null;
  return (
    <div className="journalit-account-chart-tooltip-section">
      {(data.tradeCount ?? 0) > 0 && (
        <div className="journalit-account-chart-tooltip-row journalit-account-chart-tooltip-row--spaced">
          <span className="journalit-account-chart-tooltip-label">Trades:</span>{' '}
          {data.tradeCount}
        </div>
      )}
      {data.dailyPnL !== undefined && (
        <div
          className={`journalit-account-chart-tooltip-row journalit-account-chart-tooltip-row--emphasis ${signedRowClass(isPnlMasked, data.dailyPnL)}`}
        >
          Day P&L:{' '}
          {formatChartValue(
            'pnl',
            data.dailyPnL,
            rMultipleOf(data.dailyPnL, defaultRiskAmount)
          )}
        </div>
      )}
      {cashflows && (
        <div className="journalit-account-chart-tooltip-list">
          {cashflows.map((transaction) => (
            <DayCashflowRow
              key={transaction.id}
              transaction={transaction}
              isMoneyMasked={isMoneyMasked}
              formatChartValue={formatChartValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionPointSection({
  data,
  transaction,
  isPnlMasked,
  isMoneyMasked,
  defaultRiskAmount,
  formatChartValue,
}: {
  data: BalanceChartDataPoint;
  transaction: NonNullable<BalanceChartDataPoint['transaction']>;
  isPnlMasked: boolean;
  isMoneyMasked: boolean;
  defaultRiskAmount?: number;
  formatChartValue: FormatChartValue;
}) {
  const cashflowLabel = isMoneyMasked ? 'Cashflow' : null;
  return (
    <div className="journalit-account-chart-tooltip-section">
      {data.isDeposit && (
        <div
          className={`journalit-account-chart-tooltip-row ${cashflowRowClass(isMoneyMasked, true, false)}`}
        >
          {cashflowLabel ?? 'Deposit'}:{' '}
          {formatChartValue('money', transaction.amount)}
        </div>
      )}
      {data.isWithdrawal && (
        <div
          className={`journalit-account-chart-tooltip-row ${cashflowRowClass(isMoneyMasked, false, true)}`}
        >
          {cashflowLabel ?? 'Withdrawal'}:{' '}
          {formatChartValue('money', Math.abs(transaction.amount))}
        </div>
      )}
      {data.isTrade && !data.isConsolidated && (
        <div
          className={`journalit-account-chart-tooltip-row ${signedRowClass(isPnlMasked, transaction.amount)}`}
        >
          
          {formatTradeDescription(transaction.description)}:{' '}
          {formatChartValue(
            'pnl',
            transaction.amount,
            rMultipleOf(transaction.amount, defaultRiskAmount)
          )}
        </div>
      )}
      
      {transaction.description && !data.isTrade && (
        <div className="journalit-account-chart-tooltip-description">
          {transaction.description}
        </div>
      )}
    </div>
  );
}

export const CustomTooltip: React.FC<CustomTooltipContentProps> = React.memo(
  ({ active, payload, currency, defaultRiskAmount }) => {
    const { formatValue, shouldMask } = useDisplayFormatter();

    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const isPnlMasked = shouldMask('pnl');
    const isMoneyMasked = shouldMask('money');
    const isDrawdownMasked = shouldMask('drawdown');

    const formatChartValue: FormatChartValue = (kind, value, rMultiple) =>
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
          <ConsolidatedDaySection
            data={data}
            isPnlMasked={isPnlMasked}
            isMoneyMasked={isMoneyMasked}
            defaultRiskAmount={defaultRiskAmount}
            formatChartValue={formatChartValue}
          />
        )}

        
        {data.transaction && (
          <TransactionPointSection
            data={data}
            transaction={data.transaction}
            isPnlMasked={isPnlMasked}
            isMoneyMasked={isMoneyMasked}
            defaultRiskAmount={defaultRiskAmount}
            formatChartValue={formatChartValue}
          />
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
