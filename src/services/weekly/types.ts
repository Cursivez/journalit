


interface ForecastSection {
  notes: string;
  images?: string[];
}


interface WeeklyForecast {
  monthly: ForecastSection;
  weekly: ForecastSection;
  daily: ForecastSection;
  
  customTimeframes?: Record<string, ForecastSection>;
}


export type NewsEventImpact = 'none' | 'low' | 'medium' | 'high';

export interface NewsEvent {
  event: string;
  notes: string;
  color?: string; 
  day?: string; 
  
  time?: string;
  currency?: string;
  
  eventType?: 'holiday';
  impact?: NewsEventImpact;
  forecast?: number;
  previous?: number;
  actual?: number;
  source?: string;
  seriesId?: number;
}


export interface WeeklyKeyEventsWriteState {
  keyEvents: NewsEvent[];
  keyEventsAutoImported: string[];
}


import type { KeyLevels } from '../../components/drc/types';

export interface WeeklyReviewData {
  
  type: 'weekly-review';

  
  date: string;

  
  created?: string;

  
  tags?: string[];

  
  week: string;

  
  month: string;

  
  year: string;

  
  previousGoals?: string[];

  
  previousGoalStatus?: Record<string, boolean>;

  
  weeklyGoals?: string[];

  
  weeklyGoalStatus?: Record<string, boolean>;

  
  keyLevels?: KeyLevels;

  
  checklistItems?: string[];

  
  checklistStatus?: Record<string, boolean>;

  
  keyEvents?: NewsEvent[];

  
  keyEventsAutoImported?: string[];

  
  forecast?: WeeklyForecast;

  
  mentalGrade?: number;

  
  technicalGrade?: number;

  
  mentalNotes?: string;

  
  technicalNotes?: string;

  
  reviewQuestions: Record<string, string>;

  
  nextWeekGoals?: string[];

  
  reviewed?: boolean;

  
  reviewedAt?: string;

  
  templateId?: string;

  
  templateVersion?: number;
}

export {};
