

import type { NewsEventImpact } from '../weekly/types';
import type { EconomicCalendarSyncScope } from './economicCalendarScope';

type EconomicCalendarImpact = NewsEventImpact;


export type EconomicCalendarEventType = 'release' | 'holiday';

export interface EconomicCalendarEvent {
  id: number;
  source: string;
  seriesId?: number;
  name: string;
  category?: string;
  currency: string;
  impact: EconomicCalendarImpact;
  
  eventType: EconomicCalendarEventType;
  
  scheduledAt: string;
  actual?: number;
  forecast?: number;
  previous?: number;
  lastUpdatedAt?: string;
}

export type EconomicCalendarFetchResult =
  | { status: 'ok'; events: EconomicCalendarEvent[] }
  | { status: 'not_entitled' }
  
  | { status: 'signed_out' }
  | { status: 'offline' }
  | { status: 'error' };

export interface EconomicCalendarFetchOptions {
  weekDate?: Date;
  currencies?: string[];
  
  impacts?: EconomicCalendarImpact[];
}

export interface EconomicCalendarImportOptions {
  weekDate?: Date;
  
  insertScope?: EconomicCalendarSyncScope;
  
  timeZone?: string;
  
  respectDeletions?: boolean;
}

export interface EconomicCalendarImportResult {
  filePath: string;
  importedCount: number;
  updatedCount: number;
}

export type EconomicCalendarRestoreResult =
  | ({ status: 'ok' } & EconomicCalendarImportResult)
  | { status: 'not_entitled' | 'signed_out' | 'offline' | 'error' };

export type EconomicCalendarRestoreCheckResult =
  | { status: 'ok'; missingCount: number }
  | { status: 'not_entitled' | 'signed_out' | 'offline' | 'error' };
