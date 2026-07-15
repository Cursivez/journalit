import type { TradeStatus } from '../../services/tradelog/types';

export type ImageGallerySourceType =
  | 'all'
  | 'trade'
  | 'drc'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'reviews';

export type ImageGalleryOutcome = 'winner' | 'loser' | 'breakeven' | 'unknown';

export type ImageGallerySize = 'small' | 'medium' | 'large';
export type ImageGallerySort = 'newest' | 'oldest' | 'best' | 'worst';
export type ImageGalleryViewMode = 'grouped' | 'individual';

export interface ImageGalleryAnnotation {
  tags: string[];
  notes?: string;
}

export interface ImageGalleryItem {
  id: string;
  imagePath: string;
  sourcePath: string;
  sourceType: Exclude<ImageGallerySourceType, 'all' | 'reviews'>;
  sourceLabel: string;
  date: string;
  symbol?: string;
  account?: string;
  accounts?: string[];
  direction?: string;
  tradeType?: 'regular' | 'missed' | 'backtest';
  isCopiedTrade?: boolean;
  includeInAllAccounts?: boolean;
  setupIds: string[];
  sourceTags: string[];
  mistakes: string[];
  tags: string[];
  notes?: string;
  sourceCustomFields: Record<string, string[]>;
  outcome: ImageGalleryOutcome;
  tradeStatus?: TradeStatus;
  pnl?: number;
  rMultiple?: number;
  reviewed?: boolean;
}

export interface ImageGalleryGroup {
  id: string;
  items: ImageGalleryItem[];
}
