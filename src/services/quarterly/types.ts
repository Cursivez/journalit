

export interface QuarterlyReviewFrontmatter {
  type: 'quarterly-review';
  date: string; 
  quarter: number; 
  year: number;

  
  tags?: string[];

  
  reviewQuestions?: Record<string, string>;

  
  quarterlyGoals?: string[];
  quarterlyGoalStatus?: Record<string, boolean>;
  keyFocusAreas?: string[];

  
  biggestAccomplishment?: string;
  biggestChallenge?: string;
  lessonsLearned?: string[];

  
  nextQuarterGoals?: string[];
  areasOfImprovement?: string[];

  
  reviewed?: boolean;
  reviewedAt?: string; 

  
  templateId?: string;
  templateVersion?: number;
}

export interface MonthlyPerformanceData {
  month: number; 
  monthStartDate: Date;
  monthEndDate: Date;
  trades: number;
  winRate: number;
  profitFactor: number;
  pnl: number;
  monthlyReviewPath?: string;
}

export interface QuarterlyDemonTrackerEntry {
  mistake: string;
  occurrences: number;
  dates: string[]; 
}

export interface GradeDistribution {
  A: number;
  B: number;
  C: number;
}

export interface MonthlyGamePerformance {
  month: number;
  monthStartDate: Date;
  monthEndDate: Date;
  monthlyReviewPath?: string;

  
  mentalGradeDistribution: GradeDistribution;
  technicalGradeDistribution: GradeDistribution;

  
  mentalRating?: number;
  technicalRating?: number;

  
  mentalNotes?: string;
  technicalNotes?: string;
}

export {};
