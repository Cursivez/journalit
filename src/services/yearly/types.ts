

export interface YearlyReviewFrontmatter {
  type: 'yearly-review';
  date: string; 
  year: number;

  
  tags?: string[];

  
  reviewQuestions?: Record<string, string>;

  
  yearlyGoals?: string[];
  yearlyGoalStatus?: Record<string, boolean>;
  keyFocusAreas?: string[];

  
  biggestAccomplishment?: string;
  biggestChallenge?: string;
  lessonsLearned?: string[];

  
  nextYearGoals?: string[];
  areasOfImprovement?: string[];

  
  reviewed?: boolean;
  reviewedAt?: string; 

  
  templateId?: string;
  templateVersion?: number;
}

export interface QuarterlyPerformanceData {
  quarter: number; 
  quarterStartDate: Date;
  quarterEndDate: Date;
  trades: number;
  winRate: number;
  profitFactor: number;
  pnl: number;
  quarterlyReviewPath?: string;
}

export interface YearlyDemonTrackerEntry {
  mistake: string;
  occurrences: number;
  dates: string[]; 
}

export interface GradeDistribution {
  A: number;
  B: number;
  C: number;
}

export interface QuarterlyGamePerformance {
  quarter: number;
  quarterStartDate: Date;
  quarterEndDate: Date;
  quarterlyReviewPath?: string;

  
  mentalGradeDistribution: GradeDistribution;
  technicalGradeDistribution: GradeDistribution;

  
  mentalRating?: number;
  technicalRating?: number;

  
  mentalNotes?: string;
  technicalNotes?: string;
}

export {};
