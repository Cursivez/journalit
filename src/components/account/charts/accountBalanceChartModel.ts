

import {
  formatDateDisplay,
  safeParseDateValue,
} from '../../../utils/dateUtils';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import type { usePlugin } from '../../../hooks/usePlugin';
import type { ProjectedPropChallengeRules } from '../../../services/propChallenge/PropChallengeRuleProjection';
import { generateNiceAxis } from '../../../utils/chartUtils';
import {
  AccountData,
  AccountTransaction,
  ManualDrawdownSnapshot,
  TransactionType,
  ProfitTargetType,
  DrawdownType,
} from '../../../services/account/types';
import { hasLiveBalanceAdjustment } from '../../../services/account/liveBalanceAdjustment';
import type { AccountTradeData } from '../../../services/accountPage/types';
import { propChallengePhaseBalanceTimeline } from '../../../services/propChallenge/PropChallengeRuleEngine';

function buildPhaseBalanceChartData(
  account: AccountData,
  trades: readonly AccountTradeData[],
  overlay: ProjectedPropChallengeRules,
  userDateFormat: string,
  plugin: ReturnType<typeof usePlugin>,
  getTradingDayKey: (date: Date) => string
): BalanceChartDataPoint[] {
  const config = account.propChallenge;
  const phase = config?.phases.find(
    (candidate) => candidate.id === overlay.phaseId
  );
  if (!phase || overlay.startMs === undefined) return [];
  const timeline = propChallengePhaseBalanceTimeline({
    phase,
    config,
    trades,
    transactions: account.transactions,
    now: new Date(overlay.endMs),
    tradingDayCutoffTime: plugin?.settings.trade.tradingDayCutoffTime,
  });
  const drawdown = overlay.drawdown;
  let floor = drawdown ? phase.startingBalance - drawdown.amount : undefined;
  let peak = phase.startingBalance;
  let locked = false;
  const opening = new Date(startOfLocalDay(overlay.startMs));
  const data: BalanceChartDataPoint[] = [
    {
      date: formatDateDisplay(opening, userDateFormat),
      rawDate: opening,
      balance: phase.startingBalance,
      isInitialBalance: true,
      ...(floor !== undefined ? { drawdownLevel: floor } : {}),
    },
  ];
  const days = new Map<string, typeof timeline>();
  for (const event of timeline) {
    const day = getTradingDayKey(getTradingDay(event.date, plugin));
    const events = days.get(day) ?? [];
    events.push(event);
    days.set(day, events);
  }
  const advanceFloor = (balance: number) => {
    if (!drawdown || floor === undefined || locked) return;
    const advanced = advanceTrailingFloor(
      floor,
      balance,
      peak,
      drawdown.amount,
      drawdown.lockAtBalance
    );
    floor = advanced.floor;
    peak = advanced.peak;
  };
  for (const events of days.values()) {
    const transactions: AccountTransaction[] = [];
    for (const event of events) {
      const aftermath = event.payoutAftermath;
      if (aftermath?.drawdownAction === 'lock_at_balance') {
        floor = aftermath.drawdownFloor;
        locked = true;
      } else if (aftermath?.drawdownAction === 'reset_from_starting_balance') {
        floor = drawdown ? phase.startingBalance - drawdown.amount : undefined;
        peak = phase.startingBalance;
        locked = false;
      }
      if (drawdown?.mode === 'intraday_trailing' && event.advancesTrailingPeak)
        advanceFloor(event.balance);
      if (event.transaction) transactions.push(event.transaction);
      else
        data.push({
          date: formatDateDisplay(event.date, userDateFormat),
          rawDate: event.date,
          balance: event.balance,
          ...(floor !== undefined ? { drawdownLevel: floor } : {}),
        });
    }
    const last = events[events.length - 1];
    if (drawdown?.mode === 'eod_trailing') advanceFloor(last.balance);
    if (transactions.length > 0) {
      const tradeTransactions = transactions.filter(
        (t) => t.type === TransactionType.TRADE
      );
      data.push({
        date: formatDateDisplay(last.date, userDateFormat),
        rawDate: last.date,
        balance: last.balance,
        ...(floor !== undefined ? { drawdownLevel: floor } : {}),
        isConsolidated: true,
        tradeCount: tradeTransactions.length,
        dailyPnL: tradeTransactions.reduce((sum, t) => sum + t.amount, 0),
        isTrade: tradeTransactions.length > 0,
        dayTransactions: transactions,
        hasEvents: transactions.some(
          (t) =>
            t.type === TransactionType.DEPOSIT ||
            t.type === TransactionType.WITHDRAWAL
        ),
        isDeposit: transactions.some(
          (t) => t.type === TransactionType.DEPOSIT && t.amount > 0
        ),
        isWithdrawal: transactions.some(
          (t) =>
            t.type === TransactionType.WITHDRAWAL ||
            (t.type === TransactionType.DEPOSIT && t.amount < 0)
        ),
      });
    } else {
      
      data[data.length - 1] = {
        ...data[data.length - 1],
        ...(floor !== undefined ? { drawdownLevel: floor } : {}),
      };
    }
  }
  return data;
}


export interface BalanceChartDataPoint {
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


const localDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;


export const startOfLocalDay = (ms: number): number => {
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};


const advanceTrailingFloor = (
  floor: number,
  balance: number,
  peak: number,
  amount: number,
  lockAtBalance?: number
): { floor: number; peak: number } => {
  const nextPeak = Math.max(peak, balance);
  const candidate = nextPeak - amount;
  return {
    peak: nextPeak,
    floor: Math.max(
      floor,
      lockAtBalance === undefined
        ? candidate
        : Math.min(candidate, lockAtBalance)
    ),
  };
};

export const buildBalanceChartData = (
  account: AccountData,
  userDateFormat: string,
  plugin: ReturnType<typeof usePlugin>,
  getTradingDayKey: (date: Date) => string,
  
  propChallengeOverlay: ProjectedPropChallengeRules | undefined,
  trades: readonly AccountTradeData[]
): BalanceChartDataPoint[] => {
  if (propChallengeOverlay) {
    return buildPhaseBalanceChartData(
      account,
      trades,
      propChallengeOverlay,
      userDateFormat,
      plugin,
      getTradingDayKey
    );
  }
  
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
      
      
      
      
      
      const creationDateString = localDateKey(createdDate);
      const hasTransactionOnCreationDate = sortedTransactions.some(
        (transaction) => {
          
          const transactionDate =
            transaction.date instanceof Date
              ? transaction.date
              : new Date(transaction.date);
          return localDateKey(transactionDate) === creationDateString;
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

    
    let drawdownLevel: number | undefined = initialDrawdownLevel;

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

export const calculateBalanceChartParams = (
  displayChartData: Array<
    BalanceChartDataPoint & {
      displayBalance: number;
      displayDrawdownLevel?: number;
    }
  >,
  account: AccountData,
  isBalanceMasked: boolean,
  propChallengeOverlay?: ProjectedPropChallengeRules
) => {
  if (displayChartData.length === 0) {
    return null;
  }

  
  
  const overlayProfitTargetValue = propChallengeOverlay?.profitTargetValue;
  const hasAccountProfitTarget =
    account.hasProfitTarget && account.profitTarget > 0;

  if (isBalanceMasked) {
    return {
      domain: [0, 2] as [number, number],
      ticks: [1],
      profitTargetValue:
        overlayProfitTargetValue !== undefined || hasAccountProfitTarget
          ? 1
          : undefined,
      showZeroLine: false,
    };
  }

  
  const balanceValues = displayChartData.map((point) => point.displayBalance);
  const minBalanceValue = Math.min(...balanceValues);
  const maxBalanceValue = Math.max(...balanceValues);
  let minValue = minBalanceValue;
  let maxValue = maxBalanceValue;

  
  const profitTargetValue =
    overlayProfitTargetValue ??
    (hasAccountProfitTarget
      ? account.profitTargetType === ProfitTargetType.PERCENTAGE
        ? account.initialBalance +
          (account.initialBalance * account.profitTarget) / 100
        : account.initialBalance + account.profitTarget
      : undefined);

  
  if (profitTargetValue !== undefined) {
    maxValue = Math.max(maxValue, profitTargetValue);
  }
  let meaningfulMaxValue = maxValue;

  
  
  const drawdownLevels = displayChartData.flatMap((point) =>
    point.displayDrawdownLevel === undefined ? [] : [point.displayDrawdownLevel]
  );
  const drawdownLevel =
    drawdownLevels.length > 0 ? Math.min(...drawdownLevels) : undefined;

  const dataMinValue = Math.min(minValue, drawdownLevel ?? minValue);

  
  
  
  
  
  
  const balanceRange = maxBalanceValue - minBalanceValue;
  
  
  
  
  
  
  const allowance =
    balanceRange > 0
      ? balanceRange
      : 
        Math.abs(maxBalanceValue) * 0.01 || 1;

  const desiredMin = Math.min(
    minBalanceValue,
    drawdownLevel ?? minBalanceValue
  );
  const desiredMax = Math.max(
    maxBalanceValue,
    profitTargetValue ?? maxBalanceValue
  );
  minValue = Math.max(desiredMin, minBalanceValue - allowance);
  maxValue = Math.min(desiredMax, maxBalanceValue + allowance);
  
  
  if (minValue === desiredMin) {
    minValue -= allowance * 0.05;
  }
  if (maxValue === desiredMax) {
    maxValue += allowance * 0.05;
  }
  if (balanceRange === 0) {
    
    
    meaningfulMaxValue = maxValue;
  }

  
  
  if (dataMinValue >= 0) {
    minValue = Math.max(0, minValue);
  }

  
  if (minValue > 0 && minValue < maxValue * 0.05) {
    minValue = 0;
  }

  
  
  
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

  
  
  
  
  
  
  
  const highestDrawdownLevel =
    drawdownLevels.length > 0 ? Math.max(...drawdownLevels) : undefined;
  const latestDrawdownLevel = drawdownLevels[drawdownLevels.length - 1];
  const floorFullyOffScale =
    highestDrawdownLevel !== undefined && highestDrawdownLevel < domain[0];
  const drawdownFloorValue = floorFullyOffScale
    ? latestDrawdownLevel
    : undefined;
  const drawdownFloorOffScaleBy =
    drawdownFloorValue === undefined
      ? undefined
      : domain[0] - drawdownFloorValue;
  const profitTargetOffScaleBy =
    profitTargetValue !== undefined && profitTargetValue > domain[1]
      ? profitTargetValue - domain[1]
      : undefined;

  return {
    domain,
    ticks,
    profitTargetValue,
    drawdownFloorValue,
    drawdownFloorOffScaleBy,
    profitTargetOffScaleBy,
    showZeroLine: domain[0] < 0 && domain[1] > 0,
  };
};


export function clampDrawdownSeriesToDomain<
  T extends { displayDrawdownLevel?: number },
>(points: readonly T[], floor: number | undefined): readonly T[] {
  if (floor === undefined) return points;
  return points.map((point) =>
    point.displayDrawdownLevel !== undefined &&
    point.displayDrawdownLevel < floor
      ? { ...point, displayDrawdownLevel: floor }
      : point
  );
}


export function resolveBalanceAxisPrecision(
  ticks: readonly number[] | undefined
): number | undefined {
  if (!ticks || ticks.length < 2) return 0;
  const tickSpacing = Math.min(
    ...ticks.slice(1).flatMap((tick, index) => {
      const spacing = Math.abs(tick - ticks[index]);
      return spacing > 0 ? [spacing] : [];
    })
  );
  return Number.isFinite(tickSpacing) && tickSpacing >= 1 ? 0 : undefined;
}
