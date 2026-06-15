import React, { useMemo } from 'react';
import { MonthlyWithdrawal } from './utils';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { t } from '../../../lang/helpers';

interface WithdrawalBreakdownTooltipProps {
  withdrawalsByMonth: MonthlyWithdrawal[];
}

export const WithdrawalBreakdownTooltip: React.FC<
  WithdrawalBreakdownTooltipProps
> = ({ withdrawalsByMonth }) => {
  const { currency } = useCurrency();
  const { formatValue } = useDisplayFormatter();

  const groupedByYear = useMemo(() => {
    const map = new Map<number, MonthlyWithdrawal[]>();
    for (const entry of withdrawalsByMonth) {
      const list = map.get(entry.year) || [];
      list.push(entry);
      map.set(entry.year, list);
    }
    const years = Array.from(map.keys()).sort((a, b) => b - a);
    return years.map((year) => ({ year, months: map.get(year)! }));
  }, [withdrawalsByMonth]);

  if (withdrawalsByMonth.length === 0) {
    return (
      <div className="withdrawal-breakdown-tooltip">
        <div className="withdrawal-breakdown-empty">
          {t('account-dashboard.metrics.no-withdrawals')}
        </div>
      </div>
    );
  }

  return (
    <div className="withdrawal-breakdown-tooltip">
      {groupedByYear.map(({ year, months }) => (
        <div key={year} className="withdrawal-breakdown-year">
          <div className="withdrawal-breakdown-year-label">{year}</div>
          {months.map((m) => (
            <div
              key={`${m.year}-${m.month}`}
              className="withdrawal-breakdown-row"
            >
              <span className="withdrawal-breakdown-month">
                {t(m.monthName)}
              </span>
              <span className="withdrawal-breakdown-amount">
                {formatValue({
                  kind: 'money',
                  value: m.total,
                  currencyCode: currency,
                })}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
