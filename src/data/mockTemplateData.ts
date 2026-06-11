

import { Trade, DRCFrontmatter, ForecastData } from '../components/drc/types';
import type { DemonTrackerEntry } from '../services/monthly/types';


const mockTradesDaily: Trade[] = [
  {
    id: 'mock-daily-1',
    instrument: 'META',
    ticker: 'META',
    direction: 'short',
    side: 'short',
    entryPrice: 375.0,
    exitPrice: 370.25,
    positionSize: 40,
    pnl: 190,
    entryTime: new Date('2025-01-15T11:30:00'),
    exitTime: new Date('2025-01-15T14:00:00'),
    setup: ['Reversal', 'Resistance Rejection'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.3,
    riskAmount: 150,
    stopLoss: 378.75,
    images: [],
  },
  {
    id: 'mock-daily-2',
    instrument: 'AMZN',
    ticker: 'AMZN',
    direction: 'long',
    side: 'long',
    entryPrice: 155.5,
    exitPrice: 154.0,
    positionSize: 80,
    pnl: -120,
    entryTime: new Date('2025-01-15T09:40:00'),
    exitTime: new Date('2025-01-15T10:25:00'),
    setup: ['Gap Up'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.6,
    riskAmount: 200,
    stopLoss: 153.0,
    images: [],
  },
  {
    id: 'mock-daily-3',
    instrument: 'SPY',
    ticker: 'SPY',
    direction: 'long',
    side: 'long',
    entryPrice: 473.5,
    exitPrice: 475.2,
    positionSize: 100,
    pnl: 170,
    entryTime: new Date('2025-01-15T13:15:00'),
    exitTime: new Date('2025-01-15T15:45:00'),
    setup: ['Trend Continuation'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 0.85,
    riskAmount: 200,
    stopLoss: 471.5,
    images: [],
  },
];


const mockTrades: Trade[] = [
  {
    id: 'mock-trade-1',
    instrument: 'AAPL',
    ticker: 'AAPL',
    direction: 'long',
    side: 'long',
    entryPrice: 178.5,
    exitPrice: 182.3,
    positionSize: 100,
    pnl: 380,
    entryTime: new Date('2025-01-13T09:35:00'),
    exitTime: new Date('2025-01-13T11:20:00'),
    setup: ['Breakout', 'Gap Up'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.9,
    riskAmount: 200,
    stopLoss: 176.5,
    images: [],
  },
  {
    id: 'mock-trade-2',
    instrument: 'TSLA',
    ticker: 'TSLA',
    direction: 'short',
    side: 'short',
    entryPrice: 245.0,
    exitPrice: 248.5,
    positionSize: 50,
    pnl: -175,
    entryTime: new Date('2025-01-13T13:45:00'),
    exitTime: new Date('2025-01-13T14:30:00'),
    setup: ['Reversal'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.7,
    riskAmount: 250,
    stopLoss: 247.5,
    images: [],
  },
  {
    id: 'mock-trade-3',
    instrument: 'SPY',
    ticker: 'SPY',
    direction: 'long',
    side: 'long',
    entryPrice: 472.25,
    exitPrice: 475.8,
    positionSize: 200,
    pnl: 710,
    entryTime: new Date('2025-01-14T10:00:00'),
    exitTime: new Date('2025-01-14T15:30:00'),
    setup: ['Trend Continuation'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 2.4,
    riskAmount: 300,
    stopLoss: 470.75,
    images: [],
  },
  {
    id: 'mock-trade-4',
    instrument: 'NVDA',
    ticker: 'NVDA',
    direction: 'long',
    side: 'long',
    entryPrice: 485.0,
    exitPrice: 492.5,
    positionSize: 30,
    pnl: 225,
    entryTime: new Date('2025-01-14T09:45:00'),
    exitTime: new Date('2025-01-14T12:15:00'),
    setup: ['Breakout'],
    account: 'Secondary',
    tradeStatus: 'CLOSED',
    rMultiple: 1.5,
    riskAmount: 150,
    stopLoss: 480.0,
    images: [],
  },
  {
    id: 'mock-trade-5',
    instrument: 'META',
    ticker: 'META',
    direction: 'short',
    side: 'short',
    entryPrice: 375.0,
    exitPrice: 370.25,
    positionSize: 40,
    pnl: 190,
    entryTime: new Date('2025-01-15T11:30:00'),
    exitTime: new Date('2025-01-15T14:00:00'),
    setup: ['Reversal', 'Resistance Rejection'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.3,
    riskAmount: 150,
    stopLoss: 378.75,
    images: [],
  },
  {
    id: 'mock-trade-6',
    instrument: 'AMZN',
    ticker: 'AMZN',
    direction: 'long',
    side: 'long',
    entryPrice: 155.5,
    exitPrice: 154.0,
    positionSize: 80,
    pnl: -120,
    entryTime: new Date('2025-01-15T09:40:00'),
    exitTime: new Date('2025-01-15T10:25:00'),
    setup: ['Gap Up'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.6,
    riskAmount: 200,
    stopLoss: 153.0,
    images: [],
  },
  {
    id: 'mock-trade-7',
    instrument: 'GOOGL',
    ticker: 'GOOGL',
    direction: 'long',
    side: 'long',
    entryPrice: 142.0,
    exitPrice: 145.5,
    positionSize: 100,
    pnl: 350,
    entryTime: new Date('2025-01-16T10:15:00'),
    exitTime: new Date('2025-01-16T14:45:00'),
    setup: ['Trend Continuation'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.75,
    riskAmount: 200,
    stopLoss: 140.0,
    images: [],
  },
  {
    id: 'mock-trade-8',
    instrument: 'MSFT',
    ticker: 'MSFT',
    direction: 'long',
    side: 'long',
    entryPrice: 390.0,
    exitPrice: 388.5,
    positionSize: 50,
    pnl: -75,
    entryTime: new Date('2025-01-17T09:30:00'),
    exitTime: new Date('2025-01-17T10:00:00'),
    setup: ['Breakout'],
    account: 'Secondary',
    tradeStatus: 'CLOSED',
    rMultiple: -0.5,
    riskAmount: 150,
    stopLoss: 387.0,
    images: [],
  },
];


const mockTradesMonthly: Trade[] = [
  
  {
    id: 'mock-monthly-w1-1',
    instrument: 'AAPL',
    ticker: 'AAPL',
    direction: 'long',
    side: 'long',
    entryPrice: 182.0,
    exitPrice: 185.5,
    positionSize: 100,
    pnl: 350,
    entryTime: new Date('2025-01-06T10:15:00'),
    exitTime: new Date('2025-01-06T14:30:00'),
    setup: ['Breakout'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.75,
    riskAmount: 200,
    stopLoss: 180.0,
    images: [],
  },
  {
    id: 'mock-monthly-w1-2',
    instrument: 'TSLA',
    ticker: 'TSLA',
    direction: 'short',
    side: 'short',
    entryPrice: 252.0,
    exitPrice: 248.5,
    positionSize: 50,
    pnl: 175,
    entryTime: new Date('2025-01-07T09:45:00'),
    exitTime: new Date('2025-01-07T11:30:00'),
    setup: ['Reversal'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.17,
    riskAmount: 150,
    stopLoss: 255.0,
    images: [],
  },
  {
    id: 'mock-monthly-w1-3',
    instrument: 'SPY',
    ticker: 'SPY',
    direction: 'long',
    side: 'long',
    entryPrice: 470.0,
    exitPrice: 468.5,
    positionSize: 150,
    pnl: -225,
    entryTime: new Date('2025-01-08T10:00:00'),
    exitTime: new Date('2025-01-08T11:15:00'),
    setup: ['Support Bounce'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.9,
    riskAmount: 250,
    stopLoss: 468.5,
    images: [],
  },
  {
    id: 'mock-monthly-w1-4',
    instrument: 'NVDA',
    ticker: 'NVDA',
    direction: 'long',
    side: 'long',
    entryPrice: 478.0,
    exitPrice: 485.0,
    positionSize: 40,
    pnl: 280,
    entryTime: new Date('2025-01-09T09:35:00'),
    exitTime: new Date('2025-01-09T13:45:00'),
    setup: ['Trend Continuation'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.4,
    riskAmount: 200,
    stopLoss: 473.0,
    images: [],
  },
  {
    id: 'mock-monthly-w1-5',
    instrument: 'AMD',
    ticker: 'AMD',
    direction: 'long',
    side: 'long',
    entryPrice: 138.0,
    exitPrice: 141.5,
    positionSize: 80,
    pnl: 280,
    entryTime: new Date('2025-01-10T11:00:00'),
    exitTime: new Date('2025-01-10T15:00:00'),
    setup: ['Breakout'],
    account: 'Secondary',
    tradeStatus: 'CLOSED',
    rMultiple: 1.4,
    riskAmount: 200,
    stopLoss: 136.0,
    images: [],
  },
  
  {
    id: 'mock-monthly-w2-1',
    instrument: 'AAPL',
    ticker: 'AAPL',
    direction: 'long',
    side: 'long',
    entryPrice: 178.5,
    exitPrice: 182.3,
    positionSize: 100,
    pnl: 380,
    entryTime: new Date('2025-01-13T09:35:00'),
    exitTime: new Date('2025-01-13T11:20:00'),
    setup: ['Breakout', 'Gap Up'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.9,
    riskAmount: 200,
    stopLoss: 176.5,
    images: [],
  },
  {
    id: 'mock-monthly-w2-2',
    instrument: 'TSLA',
    ticker: 'TSLA',
    direction: 'short',
    side: 'short',
    entryPrice: 245.0,
    exitPrice: 248.5,
    positionSize: 50,
    pnl: -175,
    entryTime: new Date('2025-01-13T13:45:00'),
    exitTime: new Date('2025-01-13T14:30:00'),
    setup: ['Reversal'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.7,
    riskAmount: 250,
    stopLoss: 247.5,
    images: [],
  },
  {
    id: 'mock-monthly-w2-3',
    instrument: 'SPY',
    ticker: 'SPY',
    direction: 'long',
    side: 'long',
    entryPrice: 472.25,
    exitPrice: 475.8,
    positionSize: 200,
    pnl: 710,
    entryTime: new Date('2025-01-14T10:00:00'),
    exitTime: new Date('2025-01-14T15:30:00'),
    setup: ['Trend Continuation'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 2.4,
    riskAmount: 300,
    stopLoss: 470.75,
    images: [],
  },
  {
    id: 'mock-monthly-w2-4',
    instrument: 'NVDA',
    ticker: 'NVDA',
    direction: 'long',
    side: 'long',
    entryPrice: 485.0,
    exitPrice: 492.5,
    positionSize: 30,
    pnl: 225,
    entryTime: new Date('2025-01-14T09:45:00'),
    exitTime: new Date('2025-01-14T12:15:00'),
    setup: ['Breakout'],
    account: 'Secondary',
    tradeStatus: 'CLOSED',
    rMultiple: 1.5,
    riskAmount: 150,
    stopLoss: 480.0,
    images: [],
  },
  {
    id: 'mock-monthly-w2-5',
    instrument: 'META',
    ticker: 'META',
    direction: 'short',
    side: 'short',
    entryPrice: 375.0,
    exitPrice: 370.25,
    positionSize: 40,
    pnl: 190,
    entryTime: new Date('2025-01-15T11:30:00'),
    exitTime: new Date('2025-01-15T14:00:00'),
    setup: ['Reversal', 'Resistance Rejection'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.3,
    riskAmount: 150,
    stopLoss: 378.75,
    images: [],
  },
  {
    id: 'mock-monthly-w2-6',
    instrument: 'GOOGL',
    ticker: 'GOOGL',
    direction: 'long',
    side: 'long',
    entryPrice: 142.0,
    exitPrice: 145.5,
    positionSize: 100,
    pnl: 350,
    entryTime: new Date('2025-01-16T10:15:00'),
    exitTime: new Date('2025-01-16T14:45:00'),
    setup: ['Trend Continuation'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.75,
    riskAmount: 200,
    stopLoss: 140.0,
    images: [],
  },
  
  {
    id: 'mock-monthly-w3-1',
    instrument: 'AAPL',
    ticker: 'AAPL',
    direction: 'long',
    side: 'long',
    entryPrice: 185.0,
    exitPrice: 183.0,
    positionSize: 100,
    pnl: -200,
    entryTime: new Date('2025-01-21T09:45:00'),
    exitTime: new Date('2025-01-21T10:30:00'),
    setup: ['Gap Up'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -1.0,
    riskAmount: 200,
    stopLoss: 183.0,
    images: [],
  },
  {
    id: 'mock-monthly-w3-2',
    instrument: 'TSLA',
    ticker: 'TSLA',
    direction: 'short',
    side: 'short',
    entryPrice: 240.0,
    exitPrice: 244.0,
    positionSize: 50,
    pnl: -200,
    entryTime: new Date('2025-01-21T13:00:00'),
    exitTime: new Date('2025-01-21T14:15:00'),
    setup: ['Reversal'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.8,
    riskAmount: 250,
    stopLoss: 243.0,
    images: [],
  },
  {
    id: 'mock-monthly-w3-3',
    instrument: 'SPY',
    ticker: 'SPY',
    direction: 'long',
    side: 'long',
    entryPrice: 475.0,
    exitPrice: 478.0,
    positionSize: 100,
    pnl: 300,
    entryTime: new Date('2025-01-22T10:30:00'),
    exitTime: new Date('2025-01-22T15:00:00'),
    setup: ['Support Bounce'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.2,
    riskAmount: 250,
    stopLoss: 472.5,
    images: [],
  },
  {
    id: 'mock-monthly-w3-4',
    instrument: 'META',
    ticker: 'META',
    direction: 'long',
    side: 'long',
    entryPrice: 368.0,
    exitPrice: 365.0,
    positionSize: 50,
    pnl: -150,
    entryTime: new Date('2025-01-23T09:35:00'),
    exitTime: new Date('2025-01-23T10:45:00'),
    setup: ['Breakout'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.75,
    riskAmount: 200,
    stopLoss: 365.0,
    images: [],
  },
  {
    id: 'mock-monthly-w3-5',
    instrument: 'NFLX',
    ticker: 'NFLX',
    direction: 'short',
    side: 'short',
    entryPrice: 520.0,
    exitPrice: 525.0,
    positionSize: 30,
    pnl: -150,
    entryTime: new Date('2025-01-24T11:00:00'),
    exitTime: new Date('2025-01-24T12:30:00'),
    setup: ['Resistance Rejection'],
    account: 'Secondary',
    tradeStatus: 'CLOSED',
    rMultiple: -0.6,
    riskAmount: 250,
    stopLoss: 525.0,
    images: [],
  },
  {
    id: 'mock-monthly-w3-6',
    instrument: 'AMD',
    ticker: 'AMD',
    direction: 'long',
    side: 'long',
    entryPrice: 140.0,
    exitPrice: 138.5,
    positionSize: 80,
    pnl: -120,
    entryTime: new Date('2025-01-24T14:00:00'),
    exitTime: new Date('2025-01-24T15:30:00'),
    setup: ['Support Bounce'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.6,
    riskAmount: 200,
    stopLoss: 138.5,
    images: [],
  },
  
  {
    id: 'mock-monthly-w4-1',
    instrument: 'NVDA',
    ticker: 'NVDA',
    direction: 'long',
    side: 'long',
    entryPrice: 490.0,
    exitPrice: 498.0,
    positionSize: 50,
    pnl: 400,
    entryTime: new Date('2025-01-27T09:35:00'),
    exitTime: new Date('2025-01-27T14:00:00'),
    setup: ['Trend Continuation'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 2.0,
    riskAmount: 200,
    stopLoss: 486.0,
    images: [],
  },
  {
    id: 'mock-monthly-w4-2',
    instrument: 'MSFT',
    ticker: 'MSFT',
    direction: 'long',
    side: 'long',
    entryPrice: 395.0,
    exitPrice: 392.5,
    positionSize: 60,
    pnl: -150,
    entryTime: new Date('2025-01-28T10:00:00'),
    exitTime: new Date('2025-01-28T11:00:00'),
    setup: ['Breakout'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.75,
    riskAmount: 200,
    stopLoss: 392.5,
    images: [],
  },
  {
    id: 'mock-monthly-w4-3',
    instrument: 'GOOGL',
    ticker: 'GOOGL',
    direction: 'long',
    side: 'long',
    entryPrice: 148.0,
    exitPrice: 151.0,
    positionSize: 100,
    pnl: 300,
    entryTime: new Date('2025-01-29T09:45:00'),
    exitTime: new Date('2025-01-29T14:30:00'),
    setup: ['Trend Continuation'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: 1.5,
    riskAmount: 200,
    stopLoss: 146.0,
    images: [],
  },
  {
    id: 'mock-monthly-w4-4',
    instrument: 'AMZN',
    ticker: 'AMZN',
    direction: 'short',
    side: 'short',
    entryPrice: 162.0,
    exitPrice: 159.0,
    positionSize: 80,
    pnl: 240,
    entryTime: new Date('2025-01-30T11:30:00'),
    exitTime: new Date('2025-01-30T15:00:00'),
    setup: ['Reversal'],
    account: 'Secondary',
    tradeStatus: 'CLOSED',
    rMultiple: 1.2,
    riskAmount: 200,
    stopLoss: 164.0,
    images: [],
  },
  {
    id: 'mock-monthly-w4-5',
    instrument: 'SPY',
    ticker: 'SPY',
    direction: 'long',
    side: 'long',
    entryPrice: 480.0,
    exitPrice: 478.0,
    positionSize: 100,
    pnl: -200,
    entryTime: new Date('2025-01-31T09:35:00'),
    exitTime: new Date('2025-01-31T10:30:00'),
    setup: ['Gap Up'],
    account: 'Main Account',
    tradeStatus: 'CLOSED',
    rMultiple: -0.8,
    riskAmount: 250,
    stopLoss: 477.5,
    images: [],
  },
];


const mockWeeklyPerformance = [
  {
    weekNumber: 1,
    startDate: '2025-01-06',
    endDate: '2025-01-10',
    pnl: 860,
    trades: 5,
    winRate: 80,
    avgR: 1.16,
  },
  {
    weekNumber: 2,
    startDate: '2025-01-13',
    endDate: '2025-01-17',
    pnl: 1680,
    trades: 6,
    winRate: 83,
    avgR: 1.53,
  },
  {
    weekNumber: 3,
    startDate: '2025-01-20',
    endDate: '2025-01-24',
    pnl: -520,
    trades: 6,
    winRate: 17,
    avgR: -0.43,
  },
  {
    weekNumber: 4,
    startDate: '2025-01-27',
    endDate: '2025-01-31',
    pnl: 590,
    trades: 5,
    winRate: 60,
    avgR: 0.63,
  },
];


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

const toBacktestTrades = (trades: Trade[], prefix: string): Trade[] =>
  trades.map((trade, index) => ({
    ...trade,
    id: `${prefix}-${index + 1}`,
    account: 'Backtest Lab',
    path: `mock/${prefix}-${index + 1}.md`,
    isBacktestTrade: true,
  }));

const mockBacktestTradesDaily: Trade[] = toBacktestTrades(
  mockTradesDaily.slice(0, 2),
  'backtest-daily'
);
const mockBacktestTradesWeekly: Trade[] = toBacktestTrades(
  mockTrades.slice(0, 3),
  'backtest-weekly'
);
const mockBacktestTradesMonthly: Trade[] = toBacktestTrades(
  mockTradesMonthly.slice(0, 5),
  'backtest-monthly'
);


const mockMonthlyPerformance = [
  {
    month: 1,
    monthName: 'January',
    pnl: 2610,
    trades: 22,
    winRate: 59,
    avgR: 0.58,
  },
  {
    month: 2,
    monthName: 'February',
    pnl: 3200,
    trades: 24,
    winRate: 67,
    avgR: 0.85,
  },
  {
    month: 3,
    monthName: 'March',
    pnl: 1850,
    trades: 20,
    winRate: 55,
    avgR: 0.42,
  },
];


const mockQuarterlyPerformance = [
  { quarter: 1, pnl: 7660, trades: 66, winRate: 60, avgR: 0.62 },
  { quarter: 2, pnl: 9200, trades: 72, winRate: 65, avgR: 0.78 },
  { quarter: 3, pnl: 5400, trades: 68, winRate: 58, avgR: 0.45 },
  { quarter: 4, pnl: 8100, trades: 70, winRate: 63, avgR: 0.71 },
];


const mockGoals = [
  { text: 'Follow my trading plan strictly', checked: true },
  { text: 'Maximum 3 trades per day', checked: true },
  { text: 'Wait for A+ setups only', checked: false },
  { text: 'Review each trade before closing', checked: true },
];


const mockChecklist = [
  { text: 'Review market conditions', checked: true },
  { text: 'Check economic calendar', checked: true },
  { text: 'Set risk limits for the day', checked: false },
  { text: 'Mental state check', checked: false },
];


const mockSessionMistakes = [
  'Overtrading',
  'Moved stop too early',
  'Took profit too soon',
];


const mockDRCFrontmatter: Partial<DRCFrontmatter> = {
  type: 'drc',
  date: '2025-01-15',
  mentalGrade: 'B',
  technicalGrade: 'A',
  dailyGoals: mockGoals.map((g) => g.text),
  dailyGoalStatus: mockGoals.reduce(
    (acc, goal, index) => {
      acc[`goal_${index}`] = goal.checked;
      return acc;
    },
    {} as Record<string, boolean>
  ),
  previousDayGoals: [
    'Stick to stop losses',
    'No revenge trading',
    'Take breaks between trades',
  ],
  preTradeChecklist: {
    'Reviewed market conditions': true,
    'Checked economic calendar': true,
    'Set daily risk limit': true,
    'Mental state check': false,
  },
  tradeRatings: {
    'mock-trade-5': 'A',
    'mock-trade-6': 'C',
  },
  reviewQuestions: {
    'What went well today?':
      'Followed my rules on the META short, great patience.',
    'What could be improved?':
      'Entered AMZN too early, should have waited for confirmation.',
    'Key lessons learned?':
      'Patience pays off. Wait for the setup to come to me.',
  },
  forecast: {
    daily: { notes: 'Bullish bias, looking for longs above 4750', images: [] },
    fourHour: { notes: 'Consolidating, wait for breakout', images: [] },
    oneHour: { notes: 'Higher lows forming', images: [] },
    thirtyMin: { notes: 'Clean uptrend', images: [] },
    bias: 'bullish',
  } as ForecastData,
};


const mockWeeklyFrontmatter = {
  type: 'weekly-review',
  weekNumber: 3,
  year: 2025,
  startDate: '2025-01-13',
  endDate: '2025-01-17',
  mentalGrade: 4,
  technicalGrade: 5,
  weeklyGoals: [
    'Maintain 60%+ win rate',
    'Keep average loss under $200',
    'Journal every trade same day',
  ],
  previousWeekGoals: ['Trade only A setups', 'Maximum 5 trades per day'],
  reviewNotes:
    'Strong week overall. Best performance on trend continuation setups.',
};


const mockMonthlyFrontmatter = {
  type: 'monthly-review',
  month: 1,
  year: 2025,
  mentalGrade: 4,
  technicalGrade: 4,
  monthlyGoals: [
    'Grow account by 5%',
    'Reduce revenge trading incidents',
    'Complete trading journal course',
  ],
  previousMonthGoals: [
    'Establish consistent routine',
    'Trade only during market hours',
    'Review journal daily',
  ],
  reviewNotes:
    'January was a transitional month. Implemented new journaling system. Week 3 was rough but recovered well.',
  demons: [
    { name: 'FOMO', count: 5 },
    { name: 'Revenge Trading', count: 3 },
    { name: 'Overtrading', count: 4 },
    { name: 'Moving Stop Loss', count: 2 },
    { name: 'Early Exit', count: 3 },
    { name: 'Chasing', count: 2 },
  ],
  weeklyGrades: [
    { week: 1, mental: 4, technical: 4 },
    { week: 2, mental: 5, technical: 5 },
    { week: 3, mental: 2, technical: 3 },
    { week: 4, mental: 4, technical: 4 },
  ],
};


const mockQuarterlyFrontmatter = {
  type: 'quarterly-review',
  quarter: 1,
  year: 2025,
  mentalGrade: 4,
  technicalGrade: 4,
  quarterlyGoals: [
    'Achieve 10% account growth',
    'Reduce maximum drawdown to under 5%',
    'Develop two new trading setups',
  ],
  previousQuarterGoals: [
    'Establish consistent trading routine',
    'Build proper risk management framework',
    'Journal every trade within 24 hours',
  ],
  reviewNotes:
    'Q1 2025 was a solid quarter. Best month was February with consistent execution. March had some challenges but recovered well by end of quarter.',
};


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


const drcDate = new Date('2025-01-15');
const weeklyDate = new Date('2025-01-13');
const monthlyDate = new Date('2025-01-01');
const quarterlyDate = new Date('2025-01-01');
const yearlyDate = new Date('2025-01-01');


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


const mockWeeklyGamePerformance = [
  
  {
    weekNumber: 1,
    weekStartDate: new Date('2025-01-06'),
    weekEndDate: new Date('2025-01-10'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W01.md',
    mentalGradeDistribution: { A: 2, B: 2, C: 1 },
    technicalGradeDistribution: { A: 3, B: 1, C: 1 },
    mentalRating: 3.8,
    technicalRating: 4.2,
  },
  {
    weekNumber: 2,
    weekStartDate: new Date('2025-01-13'),
    weekEndDate: new Date('2025-01-17'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W02.md',
    mentalGradeDistribution: { A: 3, B: 2, C: 0 },
    technicalGradeDistribution: { A: 4, B: 1, C: 0 },
    mentalRating: 4.5,
    technicalRating: 4.8,
  },
  {
    weekNumber: 3,
    weekStartDate: new Date('2025-01-20'),
    weekEndDate: new Date('2025-01-24'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W03.md',
    mentalGradeDistribution: { A: 1, B: 2, C: 3 },
    technicalGradeDistribution: { A: 1, B: 3, C: 2 },
    mentalRating: 2.5,
    technicalRating: 2.8,
  },
  {
    weekNumber: 4,
    weekStartDate: new Date('2025-01-27'),
    weekEndDate: new Date('2025-01-31'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W04.md',
    mentalGradeDistribution: { A: 2, B: 2, C: 1 },
    technicalGradeDistribution: { A: 2, B: 3, C: 0 },
    mentalRating: 3.6,
    technicalRating: 4.0,
  },
  
  {
    weekNumber: 5,
    weekStartDate: new Date('2025-02-03'),
    weekEndDate: new Date('2025-02-07'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W05.md',
    mentalGradeDistribution: { A: 3, B: 1, C: 1 },
    technicalGradeDistribution: { A: 4, B: 0, C: 1 },
    mentalRating: 4.0,
    technicalRating: 4.4,
  },
  {
    weekNumber: 6,
    weekStartDate: new Date('2025-02-10'),
    weekEndDate: new Date('2025-02-14'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W06.md',
    mentalGradeDistribution: { A: 2, B: 3, C: 0 },
    technicalGradeDistribution: { A: 3, B: 2, C: 0 },
    mentalRating: 4.2,
    technicalRating: 4.6,
  },
  {
    weekNumber: 7,
    weekStartDate: new Date('2025-02-17'),
    weekEndDate: new Date('2025-02-21'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W07.md',
    mentalGradeDistribution: { A: 1, B: 3, C: 1 },
    technicalGradeDistribution: { A: 2, B: 2, C: 1 },
    mentalRating: 3.2,
    technicalRating: 3.6,
  },
  {
    weekNumber: 8,
    weekStartDate: new Date('2025-02-24'),
    weekEndDate: new Date('2025-02-28'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W08.md',
    mentalGradeDistribution: { A: 4, B: 1, C: 0 },
    technicalGradeDistribution: { A: 3, B: 2, C: 0 },
    mentalRating: 4.8,
    technicalRating: 4.5,
  },
  
  {
    weekNumber: 9,
    weekStartDate: new Date('2025-03-03'),
    weekEndDate: new Date('2025-03-07'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W09.md',
    mentalGradeDistribution: { A: 2, B: 2, C: 1 },
    technicalGradeDistribution: { A: 3, B: 1, C: 1 },
    mentalRating: 3.6,
    technicalRating: 4.0,
  },
  {
    weekNumber: 10,
    weekStartDate: new Date('2025-03-10'),
    weekEndDate: new Date('2025-03-14'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W10.md',
    mentalGradeDistribution: { A: 3, B: 2, C: 0 },
    technicalGradeDistribution: { A: 4, B: 1, C: 0 },
    mentalRating: 4.4,
    technicalRating: 4.8,
  },
  {
    weekNumber: 11,
    weekStartDate: new Date('2025-03-17'),
    weekEndDate: new Date('2025-03-21'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W11.md',
    mentalGradeDistribution: { A: 1, B: 2, C: 2 },
    technicalGradeDistribution: { A: 2, B: 2, C: 1 },
    mentalRating: 2.8,
    technicalRating: 3.2,
  },
  {
    weekNumber: 12,
    weekStartDate: new Date('2025-03-24'),
    weekEndDate: new Date('2025-03-28'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W12.md',
    mentalGradeDistribution: { A: 2, B: 3, C: 0 },
    technicalGradeDistribution: { A: 3, B: 2, C: 0 },
    mentalRating: 4.0,
    technicalRating: 4.4,
  },
  {
    weekNumber: 13,
    weekStartDate: new Date('2025-03-31'),
    weekEndDate: new Date('2025-04-04'),
    weeklyReviewPath: 'Reviews/Weekly/2025-W13.md',
    mentalGradeDistribution: { A: 3, B: 1, C: 1 },
    technicalGradeDistribution: { A: 2, B: 3, C: 0 },
    mentalRating: 3.8,
    technicalRating: 4.2,
  },
];


const mockMonthlyMentalGameData = [
  {
    month: 1,
    year: 2025,
    monthName: 'January',
    mentalGradeDistribution: { A: 8, B: 8, C: 5 },
    mentalRating: 3.6,
  },
  {
    month: 2,
    year: 2025,
    monthName: 'February',
    mentalGradeDistribution: { A: 10, B: 8, C: 2 },
    mentalRating: 4.0,
  },
  {
    month: 3,
    year: 2025,
    monthName: 'March',
    mentalGradeDistribution: { A: 11, B: 10, C: 4 },
    mentalRating: 3.7,
  },
  {
    month: 4,
    year: 2025,
    monthName: 'April',
    mentalGradeDistribution: { A: 9, B: 7, C: 4 },
    mentalRating: 3.8,
  },
  {
    month: 5,
    year: 2025,
    monthName: 'May',
    mentalGradeDistribution: { A: 12, B: 6, C: 2 },
    mentalRating: 4.2,
  },
  {
    month: 6,
    year: 2025,
    monthName: 'June',
    mentalGradeDistribution: { A: 7, B: 9, C: 4 },
    mentalRating: 3.5,
  },
  {
    month: 7,
    year: 2025,
    monthName: 'July',
    mentalGradeDistribution: { A: 10, B: 8, C: 2 },
    mentalRating: 4.0,
  },
  {
    month: 8,
    year: 2025,
    monthName: 'August',
    mentalGradeDistribution: { A: 8, B: 10, C: 2 },
    mentalRating: 3.8,
  },
  {
    month: 9,
    year: 2025,
    monthName: 'September',
    mentalGradeDistribution: { A: 11, B: 7, C: 2 },
    mentalRating: 4.1,
  },
  {
    month: 10,
    year: 2025,
    monthName: 'October',
    mentalGradeDistribution: { A: 9, B: 8, C: 3 },
    mentalRating: 3.9,
  },
  {
    month: 11,
    year: 2025,
    monthName: 'November',
    mentalGradeDistribution: { A: 10, B: 9, C: 1 },
    mentalRating: 4.3,
  },
  {
    month: 12,
    year: 2025,
    monthName: 'December',
    mentalGradeDistribution: { A: 8, B: 7, C: 5 },
    mentalRating: 3.6,
  },
];

const mockMonthlyTechnicalGameData = [
  {
    month: 1,
    year: 2025,
    monthName: 'January',
    technicalGradeDistribution: { A: 10, B: 8, C: 3 },
    technicalRating: 4.0,
  },
  {
    month: 2,
    year: 2025,
    monthName: 'February',
    technicalGradeDistribution: { A: 12, B: 6, C: 2 },
    technicalRating: 4.3,
  },
  {
    month: 3,
    year: 2025,
    monthName: 'March',
    technicalGradeDistribution: { A: 14, B: 9, C: 2 },
    technicalRating: 4.1,
  },
  {
    month: 4,
    year: 2025,
    monthName: 'April',
    technicalGradeDistribution: { A: 11, B: 7, C: 2 },
    technicalRating: 4.2,
  },
  {
    month: 5,
    year: 2025,
    monthName: 'May',
    technicalGradeDistribution: { A: 13, B: 5, C: 2 },
    technicalRating: 4.4,
  },
  {
    month: 6,
    year: 2025,
    monthName: 'June',
    technicalGradeDistribution: { A: 9, B: 8, C: 3 },
    technicalRating: 3.8,
  },
  {
    month: 7,
    year: 2025,
    monthName: 'July',
    technicalGradeDistribution: { A: 11, B: 7, C: 2 },
    technicalRating: 4.1,
  },
  {
    month: 8,
    year: 2025,
    monthName: 'August',
    technicalGradeDistribution: { A: 10, B: 9, C: 1 },
    technicalRating: 4.0,
  },
  {
    month: 9,
    year: 2025,
    monthName: 'September',
    technicalGradeDistribution: { A: 12, B: 6, C: 2 },
    technicalRating: 4.2,
  },
  {
    month: 10,
    year: 2025,
    monthName: 'October',
    technicalGradeDistribution: { A: 10, B: 8, C: 2 },
    technicalRating: 4.0,
  },
  {
    month: 11,
    year: 2025,
    monthName: 'November',
    technicalGradeDistribution: { A: 11, B: 8, C: 1 },
    technicalRating: 4.4,
  },
  {
    month: 12,
    year: 2025,
    monthName: 'December',
    technicalGradeDistribution: { A: 9, B: 8, C: 3 },
    technicalRating: 3.9,
  },
];


const mockDemonData: DemonTrackerEntry[] = [
  {
    mistake: 'Moving Stop Loss',
    occurrences: 7,
    dates: [
      '2025-01-06T10:30:00.000Z',
      '2025-01-08T14:15:00.000Z',
      '2025-01-13T09:45:00.000Z',
      '2025-01-15T11:00:00.000Z',
      '2025-01-21T10:30:00.000Z',
      '2025-01-24T13:00:00.000Z',
      '2025-01-28T09:30:00.000Z',
    ],
  },
  {
    mistake: 'FOMO',
    occurrences: 5,
    dates: [
      '2025-01-07T09:35:00.000Z',
      '2025-01-14T10:00:00.000Z',
      '2025-01-16T11:30:00.000Z',
      '2025-01-22T09:45:00.000Z',
      '2025-01-29T14:00:00.000Z',
    ],
  },
  {
    mistake: 'Overtrading',
    occurrences: 4,
    dates: [
      '2025-01-10T15:00:00.000Z',
      '2025-01-17T14:30:00.000Z',
      '2025-01-23T10:45:00.000Z',
      '2025-01-30T11:00:00.000Z',
    ],
  },
  {
    mistake: 'Revenge Trading',
    occurrences: 3,
    dates: [
      '2025-01-13T14:30:00.000Z',
      '2025-01-21T14:15:00.000Z',
      '2025-01-28T11:00:00.000Z',
    ],
  },
  {
    mistake: 'Early Exit',
    occurrences: 2,
    dates: ['2025-01-09T13:45:00.000Z', '2025-01-27T14:00:00.000Z'],
  },
];


const mockKeyLevels = {
  support: [
    { price: '4,520', importance: 'High' as const },
    { price: '4,480', importance: 'Medium' as const },
    { price: '4,450', importance: null },
  ],
  resistance: [
    { price: '4,600', importance: 'High' as const },
    { price: '4,575', importance: 'Low' as const },
  ],
};


const mockKeyEvents = [
  {
    event: 'FOMC Meeting',
    notes: 'Interest rate decision expected',
    color: 'red',
    day: 'Wednesday',
  },
  {
    event: 'NFP Report',
    notes: 'Non-farm payrolls release',
    color: 'orange',
    day: 'Friday',
  },
  { event: 'CPI Data', notes: 'Inflation numbers', color: 'yellow' },
  { event: 'Earnings Season', notes: 'Tech earnings this week', color: 'gray' },
];


const mockMissedTradesDaily = [
  {
    file: null,
    instrument: 'ES',
    direction: 'Long',
    setup: ['Opening Range Breakout', 'VWAP Reclaim'],
    account: ['FundingPips 100K'],
    mistake: ['Hesitation'],
    thesis:
      'Strong opening drive with VWAP reclaim and broad market confirmation.',
    missedReason: 'Was waiting for a deeper pullback that never came',
    reviewed: true,
    entryTime: new Date('2024-01-15T10:30:00'),
    path: 'mock/missed-trade-1.md',
  },
  {
    file: null,
    instrument: 'NQ',
    direction: 'Short',
    setup: ['Failed Breakout'],
    account: ['Topstep Combine'],
    mistake: ['Late reaction', 'No alert'],
    thesis: 'Failed push into resistance after weak breadth open.',
    missedReason: 'Hesitated on entry, missed the move',
    reviewed: false,
    entryTime: new Date('2024-01-15T14:15:00'),
    path: 'mock/missed-trade-2.md',
  },
];


const mockMissedTradesWeekly = [
  
  {
    file: null,
    instrument: 'ES',
    direction: 'Long',
    setup: ['Opening Range Breakout', 'VWAP Reclaim'],
    account: ['FundingPips 100K'],
    mistake: ['Hesitation'],
    thesis: 'Opening drive reclaim with strong market breadth support.',
    missedReason: 'Was waiting for a deeper pullback that never came',
    reviewed: true,
    entryTime: new Date('2024-01-15T10:30:00'), 
    path: 'mock/missed-trade-1.md',
  },
  
  {
    file: null,
    instrument: 'NQ',
    direction: 'Short',
    setup: ['Failed Breakout'],
    account: ['Topstep Combine'],
    mistake: ['Late reaction'],
    thesis:
      'Weak bounce into prior resistance after failed overnight breakout.',
    missedReason: 'Hesitated on entry',
    reviewed: false,
    entryTime: new Date('2024-01-16T14:15:00'), 
    path: 'mock/missed-trade-2.md',
  },
  
  {
    file: null,
    instrument: 'SPY',
    direction: 'Long',
    setup: ['Gap Fill', 'Support Bounce', 'Volume Confirmation'],
    account: ['Paper Account'],
    mistake: ['No alert', 'Too focused elsewhere'],
    thesis: 'Gap fill into support with volume confirmation and clean reclaim.',
    missedReason: 'Was in another trade when signal appeared',
    reviewed: false,
    entryTime: new Date('2024-01-17T11:00:00'), 
    path: 'mock/missed-trade-3.md',
  },
  
  {
    file: null,
    instrument: 'AAPL',
    direction: 'Short',
    setup: ['Double Top'],
    account: ['Personal Watchlist'],
    mistake: ['Lack of conviction'],
    thesis: 'Double top under resistance after weak intraday bounce.',
    missedReason: "Didn't trust the setup near support",
    reviewed: false,
    entryTime: new Date('2024-01-19T15:30:00'), 
    path: 'mock/missed-trade-4.md',
  },
];


export const previewDataBundle = {
  
  trades: mockTrades, 
  tradesDaily: mockTradesDaily, 
  tradesWeekly: mockTrades, 
  tradesMonthly: mockTradesMonthly, 
  tradesQuarterly: mockTradesQuarterly, 
  tradesYearly: mockTradesYearly, 

  
  weeklyPerformance: mockWeeklyPerformance,
  monthlyPerformance: mockMonthlyPerformance,
  quarterlyPerformance: mockQuarterlyPerformance,

  
  weeklyGamePerformance: mockWeeklyGamePerformance,

  
  monthlyMentalGameData: mockMonthlyMentalGameData,
  monthlyTechnicalGameData: mockMonthlyTechnicalGameData,

  
  demonData: mockDemonData,

  
  keyLevels: mockKeyLevels,

  
  keyEvents: mockKeyEvents,

  
  missedTradesDaily: mockMissedTradesDaily,
  missedTradesWeekly: mockMissedTradesWeekly,

  
  backtestTradesDaily: mockBacktestTradesDaily,
  backtestTradesWeekly: mockBacktestTradesWeekly,
  backtestTradesMonthly: mockBacktestTradesMonthly,

  
  goals: mockGoals,
  drcFrontmatter: mockDRCFrontmatter,
  weeklyFrontmatter: mockWeeklyFrontmatter,
  monthlyFrontmatter: mockMonthlyFrontmatter,
  quarterlyFrontmatter: mockQuarterlyFrontmatter,

  
  headerData: mockHeaderData,
  stats: mockStats,
  statsMonthly: mockStatsMonthly,

  
  checklist: mockChecklist,

  
  sessionMistakes: mockSessionMistakes,
};

export {};
