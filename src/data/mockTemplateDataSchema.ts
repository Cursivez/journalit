import type { KeyLevels } from '../components/drc/types';
import type { DemonTrackerEntry } from '../services/monthly/types';

export interface MockTradeSource {
  id: string;
  instrument: string;
  ticker: string;
  direction: string;
  side: string;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  pnl: number;
  entryTime: string;
  exitTime: string;
  setup: string[];
  account: string;
  tradeStatus: string;
  rMultiple: number;
  riskAmount: number;
  stopLoss: number;
  images: string[];
}

interface PerformanceSource {
  weekNumber: number;
  startDate: string;
  endDate: string;
  pnl: number;
  trades: number;
  winRate: number;
  avgR: number;
}

interface MonthlyPerformanceSource {
  month: number;
  monthName: string;
  pnl: number;
  trades: number;
  winRate: number;
  avgR: number;
}

interface QuarterlyPerformanceSource {
  quarter: number;
  pnl: number;
  trades: number;
  winRate: number;
  avgR: number;
}

interface GoalSource {
  text: string;
  checked: boolean;
}

interface ForecastTimeframeSource {
  notes: string;
  images: string[];
}

interface DrcFrontmatterBaseSource {
  type: 'drc';
  date: string;
  mentalGrade: string;
  technicalGrade: string;
  previousDayGoals: string[];
  preTradeChecklist: Record<string, boolean>;
  tradeRatings: Record<string, string>;
  reviewQuestions: Record<string, string>;
  forecast: {
    daily: ForecastTimeframeSource;
    fourHour: ForecastTimeframeSource;
    oneHour: ForecastTimeframeSource;
    thirtyMin: ForecastTimeframeSource;
    bias: string;
  };
}

interface WeeklyFrontmatterSource {
  type: 'weekly-review';
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  mentalGrade: number;
  technicalGrade: number;
  weeklyGoals: string[];
  previousWeekGoals: string[];
  reviewNotes: string;
}

interface MonthlyReviewDemonSource {
  name: string;
  count: number;
}

interface MonthlyReviewGradeSource {
  week: number;
  mental: number;
  technical: number;
}

interface MonthlyFrontmatterSource {
  type: 'monthly-review';
  month: number;
  year: number;
  mentalGrade: number;
  technicalGrade: number;
  monthlyGoals: string[];
  previousMonthGoals: string[];
  reviewNotes: string;
  demons: MonthlyReviewDemonSource[];
  weeklyGrades: MonthlyReviewGradeSource[];
}

interface QuarterlyFrontmatterSource {
  type: 'quarterly-review';
  quarter: number;
  year: number;
  mentalGrade: number;
  technicalGrade: number;
  quarterlyGoals: string[];
  previousQuarterGoals: string[];
  reviewNotes: string;
}

interface HeaderDatesSource {
  drc: string;
  weekly: string;
  monthly: string;
  quarterly: string;
  yearly: string;
}

interface GradeDistributionSource {
  A: number;
  B: number;
  C: number;
}

export interface WeeklyGamePerformanceSource {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  weeklyReviewPath: string;
  mentalGradeDistribution: GradeDistributionSource;
  technicalGradeDistribution: GradeDistributionSource;
  mentalRating: number;
  technicalRating: number;
}

interface MonthlyMentalGameSource {
  month: number;
  year: number;
  monthName: string;
  mentalGradeDistribution: GradeDistributionSource;
  mentalRating: number;
}

interface MonthlyTechnicalGameSource {
  month: number;
  year: number;
  monthName: string;
  technicalGradeDistribution: GradeDistributionSource;
  technicalRating: number;
}

interface KeyEventSource {
  event: string;
  notes: string;
  color: string;
  day?: string;
}

export interface MissedTradeSource {
  file: null;
  instrument: string;
  direction: string;
  setup: string[];
  account: string[];
  mistake: string[];
  thesis: string;
  missedReason: string;
  reviewed: boolean;
  entryTime: string;
  path: string;
}

export interface MockTemplateStaticData {
  tradesDaily: MockTradeSource[];
  trades: MockTradeSource[];
  tradesMonthly: MockTradeSource[];
  weeklyPerformance: PerformanceSource[];
  monthlyPerformance: MonthlyPerformanceSource[];
  quarterlyPerformance: QuarterlyPerformanceSource[];
  goals: GoalSource[];
  checklist: GoalSource[];
  sessionMistakes: string[];
  drcFrontmatterBase: DrcFrontmatterBaseSource;
  weeklyFrontmatter: WeeklyFrontmatterSource;
  monthlyFrontmatter: MonthlyFrontmatterSource;
  quarterlyFrontmatter: QuarterlyFrontmatterSource;
  headerDates: HeaderDatesSource;
  weeklyGamePerformance: WeeklyGamePerformanceSource[];
  monthlyMentalGameData: MonthlyMentalGameSource[];
  monthlyTechnicalGameData: MonthlyTechnicalGameSource[];
  demonData: DemonTrackerEntry[];
  keyLevels: KeyLevels;
  keyEvents: KeyEventSource[];
  missedTradesDaily: MissedTradeSource[];
  missedTradesWeekly: MissedTradeSource[];
}

const ARRAY_KEYS = [
  'tradesDaily',
  'trades',
  'tradesMonthly',
  'weeklyPerformance',
  'monthlyPerformance',
  'quarterlyPerformance',
  'goals',
  'checklist',
  'sessionMistakes',
  'weeklyGamePerformance',
  'monthlyMentalGameData',
  'monthlyTechnicalGameData',
  'demonData',
  'keyEvents',
  'missedTradesDaily',
  'missedTradesWeekly',
] as const satisfies readonly (keyof MockTemplateStaticData)[];

const RECORD_KEYS = [
  'drcFrontmatterBase',
  'weeklyFrontmatter',
  'monthlyFrontmatter',
  'quarterlyFrontmatter',
  'headerDates',
  'keyLevels',
] as const satisfies readonly (keyof MockTemplateStaticData)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}


export function isMockTemplateStaticData(
  value: unknown
): value is MockTemplateStaticData {
  if (!isRecord(value)) {
    return false;
  }

  for (const key of ARRAY_KEYS) {
    if (!Array.isArray(value[key])) {
      return false;
    }
  }

  for (const key of RECORD_KEYS) {
    if (!isRecord(value[key])) {
      return false;
    }
  }

  return true;
}
