import type { MissedTradeFormData } from '../components/missedTrade/types';
import type { TradeFormData } from '../components/forms/trade/types';
import type { BacktestTradeFormData } from '../services/backtestTrade/BacktestTradeService';
import type { TradeData } from '../services/trade/TradeService';
import type { SetupData } from '../services/setup/types';
import {
  AccountType,
  DrawdownType,
  ProfitTargetType,
  TransactionType,
} from '../services/account/types';
import type { JournalitSettings } from '../settings/types';
import type { PropChallengeConfig } from '../services/propChallenge/types';
import { CurrencyCode } from '../utils/currencyConfig';
import type { DemoGenerationInputs } from './DemoManifest';

export const DEMO_OPTIONS_NAMESPACE = 'sample';
export const DEMO_CUSTOM_FIELDS_NAMESPACE = 'sample';

export const DEMO_TRADE_FIELD_IDS = {
  planAdherence: 'sample-plan-adherence',
  confidence: 'sample-confidence',
  confluence: 'sample-confluence',
  catalystNotes: 'sample-catalyst-notes',
} as const;

export const DEMO_REVIEW_FIELD_IDS = {
  tradingFocus: 'sample-trading-focus',
  energyLevel: 'sample-energy-level',
} as const;

export interface CompiledDemoEntity<TData> {
  entityId: string;
  data: TData;
}

export type DemoTradeData = TradeData & Partial<TradeFormData>;

export interface DemoMediaRecipe {
  entityId: string;
  path: string;
  title: string;
  description: string;
  points: number[];
  entryIndex?: number;
  exitIndexes?: number[];
  tone: 'win' | 'loss' | 'neutral';
}

export interface DemoSupportNote {
  entityId: string;
  path: string;
  title: string;
  body: string;
}

export type DemoReviewType =
  | 'drc'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export interface DemoReviewRecipe {
  entityId: string;
  type: DemoReviewType;
  date: Date;
  templateId: string;
  completed: boolean;
  completedAt?: string;
  answers: Record<string, string>;
  customFields?: Record<string, unknown>;
}

export interface CompiledDemoPack {
  inputs: DemoGenerationInputs;
  root: string;
  settings: Partial<JournalitSettings>;
  setups: Array<CompiledDemoEntity<SetupData>>;
  trades: Array<CompiledDemoEntity<DemoTradeData>>;
  missedTrades: Array<CompiledDemoEntity<MissedTradeFormData>>;
  backtestTrades: Array<CompiledDemoEntity<BacktestTradeFormData>>;
  reviews: DemoReviewRecipe[];
  media: DemoMediaRecipe[];
  supportNotes: DemoSupportNote[];
  latestSession: Date;
  recentRangeStart: Date;
}

export interface SeededRandom {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(values: readonly T[]): T;
}

export const SETUP_NAMES = [
  'Opening Range Breakout',
  'Trend Pullback',
  'Range Reversal',
  'Failed Breakout',
] as const;

export const ACCOUNTS = [
  'Example Futures',
  'Example Evaluation',
  'Example Equities',
  'Example Funded',
  'Example Failed Challenge',
] as const;


export type DemoAccountName = (typeof ACCOUNTS)[number];

export const INSTRUMENTS = ['MES', 'MNQ', 'AAPL', 'MSFT'] as const;
export const MISTAKES = [
  'Chased Entry',
  'Oversized Position',
  'Moved Stop',
  'Exited Early',
  'Ignored Checklist',
  'Traded Outside Plan',
] as const;
export const TAGS = [
  'Trend Day',
  'Range Day',
  'High Volatility',
  'Low Volatility',
  'Planned Trade',
  'Scale Out',
] as const;

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed: string): SeededRandom {
  let state = hashSeed(seed);
  const next = (): number => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  function pick<T>(values: readonly T[]): T {
    return values[Math.floor(next() * values.length)];
  }
  return {
    next,
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    pick,
  };
}

const zonedPartsFormatters = new Map<string, Intl.DateTimeFormat>();

function getZonedParts(date: Date, timezone: string): Record<string, number> {
  let formatter = zonedPartsFormatters.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    zonedPartsFormatters.set(timezone, formatter);
  }
  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)])
  );
}

function calendarDateInTimezone(date: Date, timezone: string): Date {
  const parts = getZonedParts(date, timezone);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

export function atZonedTime(
  date: Date,
  timezone: string,
  hour: number,
  minute: number,
  second = 0,
  millisecond = 0
): Date {
  const desiredUtc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    hour,
    minute,
    second,
    millisecond
  );
  let instant = desiredUtc;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actual = getZonedParts(new Date(instant), timezone);
    const actualUtc = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second,
      millisecond
    );
    const correction = desiredUtc - actualUtc;
    instant += correction;
    if (correction === 0) break;
  }
  return new Date(instant);
}

function startOfDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function endOfDay(date: Date, timezone: string): Date {
  return atZonedTime(date, timezone, 23, 59, 59, 999);
}

export function addCalendarDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export interface SampleAccountTimeline {
  futuresStart: Date;
  evaluationStart: Date;
  equitiesStart: Date;
  
  fundedStart: Date;
  failedStart: Date;
}

type SampleAccountMetadata = NonNullable<
  NonNullable<JournalitSettings['account']>['accountMetadata']
>;

export function createSampleAccountTimeline(
  latestSession: Date
): SampleAccountTimeline {
  const previousYear = latestSession.getUTCFullYear() - 1;
  const equitiesStart = new Date(Date.UTC(previousYear, 8, 8));
  return {
    futuresStart: new Date(Date.UTC(previousYear, 0, 1)),
    evaluationStart: new Date(Date.UTC(previousYear, 4, 5)),
    equitiesStart,
    
    
    
    
    
    fundedStart: dateBetween(equitiesStart, latestSession, 0.3),
    failedStart: dateBetween(equitiesStart, latestSession, 0.62),
  };
}

export function getGeneratedInstrument(
  date: Date,
  index: number,
  timeline: SampleAccountTimeline
): (typeof INSTRUMENTS)[number] {
  const availableInstruments =
    date < timeline.evaluationStart
      ? (['MES'] as const)
      : date < timeline.equitiesStart
        ? (['MES', 'MNQ'] as const)
        : INSTRUMENTS;
  return availableInstruments[index % availableInstruments.length];
}

function dateBetween(start: Date, end: Date, fraction: number): Date {
  return startOfDay(
    new Date(start.getTime() + (end.getTime() - start.getTime()) * fraction)
  );
}

export interface SamplePropChallengeConfigs {
  evaluation: PropChallengeConfig;
  funded: PropChallengeConfig;
  failed: PropChallengeConfig;
}


export interface SampleChallengePayoutRecord {
  account: DemoAccountName;
  id: string;
  amount: number;
  description: string;
  date: Date;
}

export function createSampleAccountMetadata(
  timeline: SampleAccountTimeline,
  latestSession: Date,
  createdAt: Date,
  timezone: string,
  challenges: SamplePropChallengeConfigs,
  challengePayouts: readonly SampleChallengePayoutRecord[] = []
): SampleAccountMetadata {
  const payoutsFor = (account: DemoAccountName) =>
    challengePayouts
      .filter((payout) => payout.account === account)
      .map((payout) => ({
        id: payout.id,
        date: payout.date,
        type: TransactionType.WITHDRAWAL,
        amount: -payout.amount,
        description: payout.description,
        
        
        balanceAfter: 0,
      }));
  const transaction = (
    id: string,
    accountStart: Date,
    fraction: number,
    type: TransactionType,
    amount: number,
    description: string
  ) => ({
    id,
    date: atZonedTime(
      dateBetween(accountStart, latestSession, fraction),
      timezone,
      12,
      0
    ),
    type,
    amount,
    description,
    balanceAfter: 0,
  });

  return {
    'Example Futures': {
      name: 'Example Futures',
      accountType: AccountType.DEMO,
      createdDate: atZonedTime(timeline.futuresStart, timezone, 0, 0),
      initialBalance: 25000,
      drawdownType: DrawdownType.NONE,
      drawdownAmount: 0,
      hasProfitTarget: false,
      profitTarget: 0,
      profitTargetType: ProfitTargetType.ABSOLUTE,
      monthlyCost: 0,
      manualTransactions: [
        transaction(
          'sample-futures-deposit-1',
          timeline.futuresStart,
          0.15,
          TransactionType.DEPOSIT,
          10000,
          'Illustrative capital deposit'
        ),
        transaction(
          'sample-futures-withdrawal-1',
          timeline.futuresStart,
          0.38,
          TransactionType.WITHDRAWAL,
          -4000,
          'Illustrative profit withdrawal'
        ),
        transaction(
          'sample-futures-deposit-2',
          timeline.futuresStart,
          0.64,
          TransactionType.DEPOSIT,
          7500,
          'Illustrative account top-up'
        ),
        transaction(
          'sample-futures-withdrawal-2',
          timeline.futuresStart,
          0.86,
          TransactionType.WITHDRAWAL,
          -2500,
          'Illustrative scheduled withdrawal'
        ),
      ],
      lastUpdated: new Date(createdAt),
      currency: CurrencyCode.USD,
    },
    'Example Evaluation': {
      name: 'Example Evaluation',
      accountType: AccountType.EVALUATION,
      createdDate: atZonedTime(timeline.evaluationStart, timezone, 0, 0),
      initialBalance: 50000,
      drawdownType: DrawdownType.EOD_TRAILING,
      drawdownAmount: 1500,
      hasProfitTarget: true,
      profitTarget: 1000,
      profitTargetType: ProfitTargetType.ABSOLUTE,
      monthlyCost: 49,
      manualTransactions: [
        transaction(
          'sample-evaluation-deposit',
          timeline.evaluationStart,
          0.3,
          TransactionType.DEPOSIT,
          5000,
          'Illustrative allocation increase'
        ),
        transaction(
          'sample-evaluation-withdrawal',
          timeline.evaluationStart,
          0.72,
          TransactionType.WITHDRAWAL,
          -3000,
          'Illustrative allocation reduction'
        ),
      ],
      lastUpdated: new Date(createdAt),
      currency: CurrencyCode.USD,
      propChallenge: challenges.evaluation,
    },
    'Example Equities': {
      name: 'Example Equities',
      accountType: AccountType.DEMO,
      createdDate: atZonedTime(timeline.equitiesStart, timezone, 0, 0),
      initialBalance: 15000,
      drawdownType: DrawdownType.FIXED,
      drawdownAmount: 1500,
      hasProfitTarget: false,
      profitTarget: 0,
      profitTargetType: ProfitTargetType.ABSOLUTE,
      monthlyCost: 0,
      manualTransactions: [
        transaction(
          'sample-equities-deposit-1',
          timeline.equitiesStart,
          0.18,
          TransactionType.DEPOSIT,
          8000,
          'Illustrative manual deposit'
        ),
        transaction(
          'sample-equities-withdrawal',
          timeline.equitiesStart,
          0.52,
          TransactionType.WITHDRAWAL,
          -6000,
          'Illustrative manual withdrawal'
        ),
        transaction(
          'sample-equities-deposit-2',
          timeline.equitiesStart,
          0.82,
          TransactionType.DEPOSIT,
          12000,
          'Illustrative portfolio contribution'
        ),
      ],
      lastUpdated: new Date(createdAt),
      currency: CurrencyCode.USD,
    },
    'Example Funded': {
      name: 'Example Funded',
      accountType: AccountType.FUNDED,
      createdDate: atZonedTime(timeline.fundedStart, timezone, 0, 0),
      initialBalance: 50000,
      drawdownType: DrawdownType.NONE,
      drawdownAmount: 0,
      hasProfitTarget: false,
      profitTarget: 0,
      profitTargetType: ProfitTargetType.ABSOLUTE,
      monthlyCost: 0,
      
      
      manualTransactions: [
        transaction(
          'sample-funded-allocation',
          timeline.fundedStart,
          0.05,
          TransactionType.DEPOSIT,
          5000,
          'Illustrative allocation increase'
        ),
        ...payoutsFor('Example Funded'),
      ],
      lastUpdated: new Date(createdAt),
      currency: CurrencyCode.USD,
      propChallenge: challenges.funded,
    },
    'Example Failed Challenge': {
      name: 'Example Failed Challenge',
      accountType: AccountType.EVALUATION,
      createdDate: atZonedTime(timeline.failedStart, timezone, 0, 0),
      initialBalance: 50000,
      drawdownType: DrawdownType.NONE,
      drawdownAmount: 0,
      hasProfitTarget: false,
      profitTarget: 0,
      profitTargetType: ProfitTargetType.ABSOLUTE,
      monthlyCost: 0,
      manualTransactions: [
        transaction(
          'sample-failed-allocation',
          timeline.failedStart,
          0.1,
          TransactionType.DEPOSIT,
          2500,
          'Illustrative allocation increase'
        ),
      ],
      lastUpdated: new Date(createdAt),
      currency: CurrencyCode.USD,
      propChallenge: challenges.failed,
    },
  };
}

function isEligibleSession(date: Date): boolean {
  const day = date.getUTCDay();
  return day !== 0 && day !== 6;
}

export function latestCompletedEligibleSession(
  anchor: Date,
  timezone: string
): Date {
  let candidate = calendarDateInTimezone(anchor, timezone);
  if (
    isEligibleSession(candidate) &&
    getZonedParts(anchor, timezone).hour >= 16
  ) {
    return candidate;
  }
  candidate = addCalendarDays(candidate, -1);
  while (!isEligibleSession(candidate)) {
    candidate = addCalendarDays(candidate, -1);
  }
  return candidate;
}

export function eligibleSessionsBetween(start: Date, end: Date): Date[] {
  const sessions: Date[] = [];
  for (
    let cursor = startOfDay(start);
    cursor.getTime() <= end.getTime();
    cursor = addCalendarDays(cursor, 1)
  ) {
    if (isEligibleSession(cursor)) sessions.push(cursor);
  }
  return sessions;
}

export function distributeDates(sessions: Date[], count: number): Date[] {
  if (count <= 0 || sessions.length === 0) return [];
  const dates: Date[] = [];
  for (let index = 0; index < count; index += 1) {
    const position = Math.floor((index * sessions.length) / count);
    dates.push(new Date(sessions[Math.min(position, sessions.length - 1)]));
  }
  return dates;
}

export function atSessionTime(
  date: Date,
  minutesAfterOpen: number,
  timezone: string
): Date {
  return atZonedTime(date, timezone, 9, 30 + minutesAfterOpen);
}

export function roundTo(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}

export function getInstrumentProfile(
  instrument: (typeof INSTRUMENTS)[number]
): {
  assetType: 'futures' | 'stock';
  account: (typeof ACCOUNTS)[number];
  tickSize: number;
  dollarPerPoint: number;
  basePrice: number;
} {
  switch (instrument) {
    case 'MES':
      return {
        assetType: 'futures',
        account: 'Example Futures',
        tickSize: 0.25,
        dollarPerPoint: 5,
        basePrice: 5250,
      };
    case 'MNQ':
      return {
        assetType: 'futures',
        
        
        
        account: 'Example Futures',
        tickSize: 0.25,
        dollarPerPoint: 2,
        basePrice: 18400,
      };
    case 'AAPL':
      return {
        assetType: 'stock',
        account: 'Example Equities',
        tickSize: 0.01,
        dollarPerPoint: 1,
        basePrice: 190,
      };
    case 'MSFT':
      return {
        assetType: 'stock',
        account: 'Example Equities',
        tickSize: 0.01,
        dollarPerPoint: 1,
        basePrice: 420,
      };
  }
}
