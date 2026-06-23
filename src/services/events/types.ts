

import { UnifiedFilters } from '../../components/shared/filters/types';
import type { TradeCommittedPayload } from '../trade/core/tradeCoreTypes';

export type { TradeCommittedPayload } from '../trade/core/tradeCoreTypes';


export interface TradeChangedPayload {
  action:
    | 'created'
    | 'updated'
    | 'deleted'
    | 'batch'
    | 'relocated'
    | 'loss-review-updated'
    | 'review-status-updated';
  filePaths?: string[];
  filePath?: string;
  oldFilePath?: string;
  importedCount?: number;
  timestamp?: number;
}


interface TradeFormOpenedPayload {
  mode: 'create' | 'edit';
  filePath?: string;
}


export interface MissedTradeChangedPayload {
  action: 'created' | 'updated' | 'deleted';
  filePath?: string;
  timestamp?: number;
}


export interface BacktestTradeChangedPayload {
  action: 'created' | 'updated' | 'deleted';
  filePath?: string;
  timestamp?: number;
}


export interface ReviewChangedPayload {
  type: 'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'migration';
  action: 'created' | 'updated' | 'deleted' | 'opened' | 'bulk-migrated';
  filePath?: string;
  source?: string;
  count?: number;
}


export interface SettingsChangedPayload {
  component?: string;
  section?: string;
  source?: string;
  settings?: unknown;
}


export interface OptionsChangedPayload {
  timestamp: number;
  namespace?: string;
  optionType?: string;
  action?: string;
  accountType?: string;
  instrument?: string;
  assetType?: string;
  applyToTrades?: boolean;
}


export interface AccountChangedPayload {
  action:
    | 'created'
    | 'updated'
    | 'deleted'
    | 'type-changed'
    | 'transaction-added'
    | 'transaction-deleted'
    | 'batch-updated';
  accountId?: string;
  accountName?: string;
  accountNames?: string[];
  accountType?: string;
  timestamp?: number;
}


interface DataChangedPayload {
  action: 'updated' | 'created' | 'deleted';
  filePath: string;
  type?: 'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}


interface WidgetsChangedPayload {
  activeWidgets: string[];
}


interface MetricsChangedPayload {
  activeMetrics: string[];
}


export interface DefaultTemplateChangedPayload {
  type: 'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'trade';
  value: string | null;
}


export interface FolderPathChangedPayload {
  type: 'changed';
  value: string;
}


export interface FilterChangedPayload {
  filePath: string;
  filters: UnifiedFilters;
}


export interface ReviewFilterSyncPayload {
  sourceFilePath: string;
  filters: UnifiedFilters;
}


interface IndexInvalidatedPayload {
  indexName: string;
  reason: 'mutation' | 'file-change' | 'manual';
}


interface IndexReadyPayload {
  indexName: string;
}


interface RecentItemsChangedPayload {
  recentItems: Array<{ path: string; timestamp: number; type: string }>;
}


interface LayoutChangedPayload {
  view: 'home' | 'dashboard';
  layoutName: string;
}


export interface EventMap {
  
  'trade:changed': TradeChangedPayload;
  'trade:committed': TradeCommittedPayload;
  'trade-form:opened': TradeFormOpenedPayload;
  'missed-trade:changed': MissedTradeChangedPayload;
  'backtest-trade:changed': BacktestTradeChangedPayload;

  
  'review:changed': ReviewChangedPayload;
  'filter:changed': FilterChangedPayload;
  'tradelog:filters-updated': void;
  'review:filter-sync': ReviewFilterSyncPayload;
  'data:changed': DataChangedPayload;

  
  'settings:changed': SettingsChangedPayload;
  'options:changed': OptionsChangedPayload;
  'default-template:changed': DefaultTemplateChangedPayload;
  'trade-template:changed': void;
  'review-template:changed': void;
  'folder-path:changed': FolderPathChangedPayload;

  
  'account:changed': AccountChangedPayload;

  
  'widgets:changed': WidgetsChangedPayload;
  'metrics:changed': MetricsChangedPayload;
  'recent-items:changed': RecentItemsChangedPayload;
  'layout:changed': LayoutChangedPayload;

  
  'index:invalidated': IndexInvalidatedPayload;
  'index:ready': IndexReadyPayload;

  
  'plugin:updated': void;
}


export type EventName = keyof EventMap;


export type EventCallback<K extends EventName> = (
  payload: EventMap[K]
) => void | Promise<void>;


export type Unsubscribe = () => void;
