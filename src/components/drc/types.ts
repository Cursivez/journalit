


export interface ForecastTimeframeSection {
  notes: string;
  images?: string[];
}


export interface ForecastData {
  daily: ForecastTimeframeSection;
  fourHour: ForecastTimeframeSection;
  oneHour: ForecastTimeframeSection;
  thirtyMin: ForecastTimeframeSection;
  customTimeframes?: Record<string, ForecastTimeframeSection>;
  bias: string;
  levels?: string;
  keyLevels?: KeyLevels;
  
  [key: string]:
    | ForecastTimeframeSection
    | Record<string, ForecastTimeframeSection>
    | string
    | KeyLevels
    | undefined;
}


export interface KeyLevel {
  price: string;
  importance: 'High' | 'Medium' | 'Low' | null;
}


export interface KeyLevels {
  support: KeyLevel[];
  resistance: KeyLevel[];
}

export interface DRCFrontmatter {
  type: 'drc';
  date: string; 

  
  preTradeChecklist: Record<string, boolean>; 
  
  forecast?: ForecastData;

  youtubeLink?: string;

  
  dailyGoalStatus?: Record<string, boolean>; 

  
  previousDayGoals?: string[];

  
  mentalGrade: string; 
  technicalGrade: string; 

  
  tradeRatings: Record<string, string>; 

  
  reviewQuestions: Record<string, string>; 

  
  dailyGoals: string[];

  
  sessionMistakes?: string[];

  
  endOfDayReview?: {
    images?: string[];
    timestamp?: string; 
    reviewed?: boolean; 
    reviewedAt?: string; 
  };
}


export interface Trade {
  id: string;
  instrument: string;
  direction: string;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  pnl?: number;
  entryTime: Date;
  exitTime?: Date;

  
  path?: string;
  ticker?: string; 
  side?: string; 
  setup?: string[] | string; 
  images?: string[]; 
  assetType?: string; 
  optionType?: string; 
  account?: string | string[]; 

  tradeStatus?: string; 
  useDirectPnLInput?: boolean; 
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>; 
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>; 

  
  _originalPnlWasNull?: boolean;

  
  backendTradeId?: number;

  
  isMissedTrade?: boolean;

  
  isBacktestTrade?: boolean;

  
  commission?: number;

  
  swap?: number;

  
  fees?: number;

  
  stopLoss?: number;

  
  riskAmount?: number;

  
  rMultiple?: number;
}

export {};
