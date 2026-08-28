

import type { DRCFrontmatter, Trade } from '../components/drc/types';
import type { WeeklyGamePerformance } from '../services/monthly/types';
import {
  isMockTemplateStaticData,
  type MockTemplateStaticData,
  type MockTradeSource,
  type MissedTradeSource,
  type WeeklyGamePerformanceSource,
} from './mockTemplateDataSchema';
import { mockTemplateDataPack } from './compressedData.generated';
import { decodeCompressedJson } from '../utils/compressedData';

let mockTemplateDataCache: MockTemplateStaticData | null = null;

export function getMockTemplateData(): MockTemplateStaticData {
  if (mockTemplateDataCache) {
    return mockTemplateDataCache;
  }

  const parsed = decodeCompressedJson(mockTemplateDataPack);
  if (!isMockTemplateStaticData(parsed)) {
    throw new Error('Invalid generated mock template data payload');
  }

  mockTemplateDataCache = parsed;
  return mockTemplateDataCache;
}

function toTrade(trade: MockTradeSource): Trade {
  return {
    ...trade,
    entryTime: new Date(trade.entryTime),
    exitTime: new Date(trade.exitTime),
  };
}

function toWeeklyGamePerformance(
  performance: WeeklyGamePerformanceSource
): WeeklyGamePerformance {
  return {
    ...performance,
    weekStartDate: new Date(performance.weekStartDate),
    weekEndDate: new Date(performance.weekEndDate),
  };
}

function toMissedTrade(trade: MissedTradeSource) {
  return {
    ...trade,
    entryTime: new Date(trade.entryTime),
  };
}


const generateMockTrades = (
  startDate: Date,
  endDate: Date,
  tradesPerWeek: number,
  idPrefix: string
): Trade[] => {
  const trades: Trade[] = [];
  const tickers = [
    'AAPL',
    'TSLA',
    'SPY',
    'NVDA',
    'META',
    'AMZN',
    'GOOGL',
    'MSFT',
    'AMD',
    'NFLX',
    'QQQ',
    'IWM',
  ];
  const setups = [
    'Breakout',
    'Reversal',
    'Trend Continuation',
    'Gap Up',
    'Support Bounce',
    'Resistance Rejection',
    'VWAP Bounce',
  ];
  const accounts = ['Main Account', 'Secondary'];

  let tradeIndex = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      
      const tradesThisDay = Math.floor(Math.random() * 3);

      for (
        let i = 0;
        i < tradesThisDay && tradeIndex < tradesPerWeek * 52;
        i++
      ) {
        const ticker = tickers[tradeIndex % tickers.length];
        const isLong = Math.random() > 0.4; 
        const isWinner = Math.random() > 0.4; 
        const entryPrice = 100 + Math.random() * 400;
        const priceChange = (Math.random() * 0.05 + 0.005) * entryPrice; 
        const exitPrice = isLong
          ? isWinner
            ? entryPrice + priceChange
            : entryPrice - priceChange
          : isWinner
            ? entryPrice - priceChange
            : entryPrice + priceChange;
        const positionSize = Math.floor(20 + Math.random() * 180);
        const pnl = Math.round(
          (isLong ? exitPrice - entryPrice : entryPrice - exitPrice) *
            positionSize
        );

        const entryHour = 9 + Math.floor(Math.random() * 6);
        const entryMinute = Math.floor(Math.random() * 60);
        const exitHour = entryHour + 1 + Math.floor(Math.random() * 3);

        trades.push({
          id: `${idPrefix}-${tradeIndex}`,
          instrument: ticker,
          ticker: ticker,
          direction: isLong ? 'long' : 'short',
          side: isLong ? 'long' : 'short',
          entryPrice: Math.round(entryPrice * 100) / 100,
          exitPrice: Math.round(exitPrice * 100) / 100,
          positionSize,
          pnl,
          entryTime: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            entryHour,
            entryMinute
          ),
          exitTime: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            exitHour,
            entryMinute
          ),
          setup: [setups[Math.floor(Math.random() * setups.length)]],
          account: accounts[Math.floor(Math.random() * accounts.length)],
          tradeStatus: 'CLOSED',
          rMultiple: Math.round((pnl / 200) * 100) / 100,
          riskAmount: 200,
          stopLoss:
            Math.round((isLong ? entryPrice - 2 : entryPrice + 2) * 100) / 100,
          images: [],
        });

        tradeIndex++;
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return trades;
};

const toBacktestTrades = (trades: Trade[], prefix: string): Trade[] =>
  trades.map((trade, index) => ({
    ...trade,
    id: `${prefix}-${index + 1}`,
    account: 'Backtest Lab',
    path: `mock/${prefix}-${index + 1}.md`,
    isBacktestTrade: true,
  }));


const formatDRCDate = (date: Date): string => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatWeeklyDate = (date: Date, weekNumber: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `W${weekNumber} - ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatMonthlyDate = (date: Date): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatQuarterlyDate = (date: Date): string => {
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

const formatYearlyDate = (date: Date): string => {
  return `${date.getFullYear()}`;
};

const PREVIEW_BREAK_EVEN_ACCOUNT_BALANCE = 100_000;
const PREVIEW_TAGS = [
  ['A+', 'Patient Entry'],
  ['High Volume'],
  ['Trend Day', 'A+'],
  ['Late Entry'],
  ['FOMO'],
  ['News Catalyst', 'High Volume'],
] as const;

function withPreviewTradeDefaults(trades: Trade[]): Trade[] {
  return trades.map((trade, index) => ({
    ...trade,
    customTags: [...PREVIEW_TAGS[index % PREVIEW_TAGS.length]],
    breakEvenAccountCurrentBalanceTotal: PREVIEW_BREAK_EVEN_ACCOUNT_BALANCE,
  }));
}

function createPreviewDataBundle() {
  const staticData = getMockTemplateData();
  
  const mockTradesQuarterly: Trade[] = generateMockTrades(
    new Date('2025-01-01'),
    new Date('2025-03-31'),
    5, 
    'mock-quarterly'
  );

  
  const mockTradesYearly: Trade[] = generateMockTrades(
    new Date('2025-01-01'),
    new Date('2025-12-31'),
    5, 
    'mock-yearly'
  );

  const mockTradesDaily = staticData.tradesDaily.map(toTrade);
  const mockTrades = staticData.trades.map(toTrade);
  const mockTradesMonthly = staticData.tradesMonthly.map(toTrade);
  const mockWeeklyGamePerformance = staticData.weeklyGamePerformance.map(
    toWeeklyGamePerformance
  );
  const mockMissedTradesDaily = staticData.missedTradesDaily.map(toMissedTrade);
  const mockMissedTradesWeekly =
    staticData.missedTradesWeekly.map(toMissedTrade);

  const mockDRCFrontmatter: Partial<DRCFrontmatter> = {
    ...staticData.drcFrontmatterBase,
    dailyGoals: staticData.goals.map((goal) => goal.text),
    dailyGoalStatus: staticData.goals.reduce<Record<string, boolean>>(
      (acc, goal, index) => {
        acc[`goal_${index}`] = goal.checked;
        return acc;
      },
      {}
    ),
  };

  const drcDate = new Date(staticData.headerDates.drc);
  const weeklyDate = new Date(staticData.headerDates.weekly);
  const monthlyDate = new Date(staticData.headerDates.monthly);
  const quarterlyDate = new Date(staticData.headerDates.quarterly);
  const yearlyDate = new Date(staticData.headerDates.yearly);

  const mockHeaderData = {
    drc: {
      date: drcDate,
      title: formatDRCDate(drcDate),
      reviewType: 'drc' as const,
    },
    weekly: {
      date: weeklyDate,
      title: formatWeeklyDate(weeklyDate, 3),
      reviewType: 'weekly' as const,
      weekNumber: 3,
    },
    monthly: {
      date: monthlyDate,
      title: formatMonthlyDate(monthlyDate),
      reviewType: 'monthly' as const,
      month: 'January',
      year: 2025,
    },
    quarterly: {
      date: quarterlyDate,
      title: formatQuarterlyDate(quarterlyDate),
      reviewType: 'quarterly' as const,
      quarter: 1,
      year: 2025,
    },
    yearly: {
      date: yearlyDate,
      title: formatYearlyDate(yearlyDate),
      reviewType: 'yearly' as const,
      year: 2025,
    },
  };

  const mockStats = {
    totalTrades: mockTrades.length,
    winningTrades: mockTrades.filter((t) => (t.pnl ?? 0) > 0).length,
    losingTrades: mockTrades.filter((t) => (t.pnl ?? 0) < 0).length,
    totalPnl: mockTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0),
    winRate: Math.round(
      (mockTrades.filter((t) => (t.pnl ?? 0) > 0).length / mockTrades.length) *
        100
    ),
    avgWin: Math.round(
      mockTrades
        .filter((t) => (t.pnl ?? 0) > 0)
        .reduce((sum, t) => sum + (t.pnl ?? 0), 0) /
        mockTrades.filter((t) => (t.pnl ?? 0) > 0).length
    ),
    avgLoss: Math.round(
      Math.abs(
        mockTrades
          .filter((t) => (t.pnl ?? 0) < 0)
          .reduce((sum, t) => sum + (t.pnl ?? 0), 0) /
          mockTrades.filter((t) => (t.pnl ?? 0) < 0).length
      )
    ),
    profitFactor: 1.85,
    avgRMultiple: 0.88,
  };

  const mockStatsMonthly = {
    totalTrades: mockTradesMonthly.length,
    winningTrades: mockTradesMonthly.filter((t) => (t.pnl ?? 0) > 0).length,
    losingTrades: mockTradesMonthly.filter((t) => (t.pnl ?? 0) < 0).length,
    totalPnl: mockTradesMonthly.reduce((sum, t) => sum + (t.pnl ?? 0), 0),
    winRate: Math.round(
      (mockTradesMonthly.filter((t) => (t.pnl ?? 0) > 0).length /
        mockTradesMonthly.length) *
        100
    ),
    avgWin: Math.round(
      mockTradesMonthly
        .filter((t) => (t.pnl ?? 0) > 0)
        .reduce((sum, t) => sum + (t.pnl ?? 0), 0) /
        mockTradesMonthly.filter((t) => (t.pnl ?? 0) > 0).length
    ),
    avgLoss: Math.round(
      Math.abs(
        mockTradesMonthly
          .filter((t) => (t.pnl ?? 0) < 0)
          .reduce((sum, t) => sum + (t.pnl ?? 0), 0) /
          mockTradesMonthly.filter((t) => (t.pnl ?? 0) < 0).length
      )
    ),
    profitFactor: 1.62,
    avgRMultiple: 0.58,
  };

  const mockBacktestTradesDaily = toBacktestTrades(
    mockTradesDaily.slice(0, 2),
    'backtest-daily'
  );
  const mockBacktestTradesWeekly = toBacktestTrades(
    mockTrades.slice(0, 3),
    'backtest-weekly'
  );
  const mockBacktestTradesMonthly = toBacktestTrades(
    mockTradesMonthly.slice(0, 5),
    'backtest-monthly'
  );

  return {
    
    trades: withPreviewTradeDefaults(mockTrades),
    tradesDaily: withPreviewTradeDefaults(mockTradesDaily),
    tradesWeekly: withPreviewTradeDefaults(mockTrades),
    tradesMonthly: withPreviewTradeDefaults(mockTradesMonthly),
    tradesQuarterly: withPreviewTradeDefaults(mockTradesQuarterly),
    tradesYearly: withPreviewTradeDefaults(mockTradesYearly),

    
    weeklyPerformance: staticData.weeklyPerformance,
    monthlyPerformance: staticData.monthlyPerformance,
    quarterlyPerformance: staticData.quarterlyPerformance,

    
    weeklyGamePerformance: mockWeeklyGamePerformance,

    
    monthlyMentalGameData: staticData.monthlyMentalGameData,
    monthlyTechnicalGameData: staticData.monthlyTechnicalGameData,

    
    demonData: staticData.demonData,

    
    keyLevels: staticData.keyLevels,

    
    keyEvents: staticData.keyEvents,

    
    missedTradesDaily: mockMissedTradesDaily,
    missedTradesWeekly: mockMissedTradesWeekly,

    
    backtestTradesDaily: mockBacktestTradesDaily,
    backtestTradesWeekly: mockBacktestTradesWeekly,
    backtestTradesMonthly: mockBacktestTradesMonthly,

    
    goals: staticData.goals,
    drcFrontmatter: mockDRCFrontmatter,
    weeklyFrontmatter: staticData.weeklyFrontmatter,
    monthlyFrontmatter: staticData.monthlyFrontmatter,
    quarterlyFrontmatter: staticData.quarterlyFrontmatter,

    
    headerData: mockHeaderData,
    stats: mockStats,
    statsMonthly: mockStatsMonthly,

    
    checklist: staticData.checklist,

    
    sessionMistakes: staticData.sessionMistakes,
  };
}

type PreviewDataBundle = ReturnType<typeof createPreviewDataBundle>;
let previewDataBundleCache: PreviewDataBundle | null = null;

function getPreviewDataBundle(): PreviewDataBundle {
  if (previewDataBundleCache) {
    return previewDataBundleCache;
  }

  previewDataBundleCache = createPreviewDataBundle();
  return previewDataBundleCache;
}


export const previewDataBundle: PreviewDataBundle = {
  get trades() {
    return getPreviewDataBundle().trades;
  },
  get tradesDaily() {
    return getPreviewDataBundle().tradesDaily;
  },
  get tradesWeekly() {
    return getPreviewDataBundle().tradesWeekly;
  },
  get tradesMonthly() {
    return getPreviewDataBundle().tradesMonthly;
  },
  get tradesQuarterly() {
    return getPreviewDataBundle().tradesQuarterly;
  },
  get tradesYearly() {
    return getPreviewDataBundle().tradesYearly;
  },
  get weeklyPerformance() {
    return getPreviewDataBundle().weeklyPerformance;
  },
  get monthlyPerformance() {
    return getPreviewDataBundle().monthlyPerformance;
  },
  get quarterlyPerformance() {
    return getPreviewDataBundle().quarterlyPerformance;
  },
  get weeklyGamePerformance() {
    return getPreviewDataBundle().weeklyGamePerformance;
  },
  get monthlyMentalGameData() {
    return getPreviewDataBundle().monthlyMentalGameData;
  },
  get monthlyTechnicalGameData() {
    return getPreviewDataBundle().monthlyTechnicalGameData;
  },
  get demonData() {
    return getPreviewDataBundle().demonData;
  },
  get keyLevels() {
    return getPreviewDataBundle().keyLevels;
  },
  get keyEvents() {
    return getPreviewDataBundle().keyEvents;
  },
  get missedTradesDaily() {
    return getPreviewDataBundle().missedTradesDaily;
  },
  get missedTradesWeekly() {
    return getPreviewDataBundle().missedTradesWeekly;
  },
  get backtestTradesDaily() {
    return getPreviewDataBundle().backtestTradesDaily;
  },
  get backtestTradesWeekly() {
    return getPreviewDataBundle().backtestTradesWeekly;
  },
  get backtestTradesMonthly() {
    return getPreviewDataBundle().backtestTradesMonthly;
  },
  get goals() {
    return getPreviewDataBundle().goals;
  },
  get drcFrontmatter() {
    return getPreviewDataBundle().drcFrontmatter;
  },
  get weeklyFrontmatter() {
    return getPreviewDataBundle().weeklyFrontmatter;
  },
  get monthlyFrontmatter() {
    return getPreviewDataBundle().monthlyFrontmatter;
  },
  get quarterlyFrontmatter() {
    return getPreviewDataBundle().quarterlyFrontmatter;
  },
  get headerData() {
    return getPreviewDataBundle().headerData;
  },
  get stats() {
    return getPreviewDataBundle().stats;
  },
  get statsMonthly() {
    return getPreviewDataBundle().statsMonthly;
  },
  get checklist() {
    return getPreviewDataBundle().checklist;
  },
  get sessionMistakes() {
    return getPreviewDataBundle().sessionMistakes;
  },
};

export {};
