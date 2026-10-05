import type { AccountData } from '../../../services/account/types';
import { formatLocalDateString } from '../../../utils/dateUtils';
import {
  getTradingDay,
  DEFAULT_TRADING_DAY_CUTOFF_TIME,
} from '../../../utils/tradingDayUtils';


export function calculateCurrentAumMetrics(
  accounts: Pick<
    AccountData,
    'initialBalance' | 'currentBalance' | 'transactions' | 'createdDate'
  >[],
  endDay: Date,
  tradingDayCutoffTime = DEFAULT_TRADING_DAY_CUTOFF_TIME
) {
  const settings = { settings: { trade: { tradingDayCutoffTime } } };
  const tradingDayKey = (date: Date) =>
    formatLocalDateString(getTradingDay(date, settings));
  const start = new Date(endDay);
  start.setDate(start.getDate() - 29);
  const todayKey = formatLocalDateString(endDay);
  const startKey = formatLocalDateString(start);
  let previousAUM = 0;
  
  const points = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return { date: formatLocalDateString(date), total: 0 };
  });
  for (const account of accounts) {
    
    
    const creationKey = formatLocalDateString(account.createdDate);
    
    
    
    const balances = account.transactions.map((transaction) => ({
      date: tradingDayKey(transaction.date),
      balance: transaction.balanceAfter,
    }));
    let balance = account.initialBalance;
    let index = 0;
    
    while (index < balances.length && balances[index].date < startKey) {
      balance = balances[index++].balance;
    }
    previousAUM += creationKey < startKey ? balance : 0;
    for (const point of points) {
      while (index < balances.length && balances[index].date <= point.date) {
        balance = balances[index++].balance;
      }
      if (point.date >= creationKey) {
        point.total +=
          point.date >= todayKey ? account.currentBalance : balance;
      }
    }
  }
  const sparklineData = points.map((point) => point.total);
  const totalAUM = sparklineData[sparklineData.length - 1];
  const changeAmount = totalAUM - previousAUM;
  const changePercent =
    previousAUM !== 0 ? (changeAmount / previousAUM) * 100 : 0;
  return { totalAUM, previousAUM, changeAmount, changePercent, sparklineData };
}
