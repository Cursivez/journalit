


interface MissedTrade {
  instrument: string;
  setup: string[];
  notes: string;
  images?: string[]; 
}


interface TradeRating {
  rating: number; 
  notes: string;
}


interface ForecastSection {
  notes: string;
  images?: string[];
}


interface KeyLevel {
  price: string;
  importance: 'High' | 'Medium' | 'Low' | null;
}


interface KeyLevels {
  support: KeyLevel[];
  resistance: KeyLevel[];
}


interface DRCForecast {
  daily: ForecastSection;
  fourHour: ForecastSection;
  oneHour: ForecastSection;
  thirtyMin: ForecastSection;
  customTimeframes?: Record<string, ForecastSection>;
  bias: string; 
  levels?: string; 
  keyLevels?: KeyLevels; 

  
  [key: string]:
    | ForecastSection
    | Record<string, ForecastSection>
    | string
    | KeyLevels
    | undefined;
}


export interface DRCData {
  
  date: string;

  
  tags?: string[];

  
  preTradeChecklist: Record<string, boolean>;

  
  forecast?: DRCForecast;

  
  youtubeLink?: string;

  
  dailyGoals?: string[];

  
  previousDayGoals?: string[];

  
  dailyGoalStatus?: Record<string, boolean>; 

  
  mentalGrade: 'A' | 'B' | 'C';

  
  technicalGrade: 'A' | 'B' | 'C';

  
  tradeRatings: Record<string, TradeRating>;

  
  reviewQuestions: Record<string, string>;

  
  sessionMistakes?: string[];

  
  sessionLog?: import('../../types/sessionLog').SessionLogEntry[];

  
  sessionModeTradeGateRuns?: import('../../types/sessionMode').TradeGateRun[];

  
  sessionModeTradeGateActiveRun?:
    | import('../../types/sessionMode').TradeGateRun
    | null;

  
  missedTrades: MissedTrade[];
}

export {};
