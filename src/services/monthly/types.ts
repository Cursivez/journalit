

import type { KeyLevels } from '../../components/drc/types';

export interface MonthlyReviewFrontmatter {
  type: 'monthly-review';
  date: string; 
  month: number; 
  year: number;

  
  tags?: string[];

  
  reviewQuestions?: Record<string, string>;

  
  monthlyGoals?: string[];
  monthlyGoalStatus?: Record<string, boolean>;
  keyFocusAreas?: string[];

  
  keyLevels?: KeyLevels;

  
  biggestAccomplishment?: string;
  biggestChallenge?: string;
  lessonsLearned?: string[];

  
  nextMonthGoals?: string[];
  areasOfImprovement?: string[];

  
  reviewed?: boolean;
  reviewedAt?: string; 

  
  templateId?: string;
  templateVersion?: number;
}

export interface WeeklyPerformanceData {
  weekNumber: number;
  weekStartDate: Date;
  weekEndDate: Date;
  trades: number;
  winRate: number;
  profitFactor: number;
  pnl: number;
  weeklyReviewPath?: string;
}

export interface DemonTrackerEntry {
  mistake: string;
  occurrences: number;
  dates: string[]; 
}

export interface GradeDistribution {
  A: number;
  B: number;
  C: number;
}

export interface WeeklyGamePerformance {
  weekNumber: number;
  weekStartDate: Date;
  weekEndDate: Date;
  weeklyReviewPath?: string;

  
  mentalGradeDistribution: GradeDistribution;
  technicalGradeDistribution: GradeDistribution;

  
  mentalRating?: number;
  technicalRating?: number;

  
  mentalNotes?: string;
  technicalNotes?: string;
}

export {};
