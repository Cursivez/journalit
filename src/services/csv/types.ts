



const DATE_FORMAT_VALUES = [
  '', 
  'MM/dd/yyyy', 
  'MM/dd/yyyy HH:mm:ss', 
  'M/d/yyyy', 
  'M/d/yyyy HH:mm:ss', 
  'yyyy-MM-dd HH:mm:ss', 
  'yyyy-MM-dd', 
  'dd/MM/yyyy', 
  'dd/MM/yyyy HH:mm:ss', 
  'dd-MM-yyyy', 
  'dd-MM-yyyy HH:mm:ss', 
] as const;

import { t, type TranslationKey } from '../../lang/helpers';


const DATE_FORMAT_KEYS: Record<
  (typeof DATE_FORMAT_VALUES)[number],
  TranslationKey
> = {
  '': 'csv.date-format.auto-detect',
  'MM/dd/yyyy': 'csv.date-format.us-date',
  'MM/dd/yyyy HH:mm:ss': 'csv.date-format.us-datetime',
  'M/d/yyyy': 'csv.date-format.us-short',
  'M/d/yyyy HH:mm:ss': 'csv.date-format.us-short-datetime',
  'yyyy-MM-dd HH:mm:ss': 'csv.date-format.iso-datetime',
  'yyyy-MM-dd': 'csv.date-format.iso-date',
  'dd/MM/yyyy': 'csv.date-format.eu-date',
  'dd/MM/yyyy HH:mm:ss': 'csv.date-format.eu-datetime',
  'dd-MM-yyyy': 'csv.date-format.eu-dash',
  'dd-MM-yyyy HH:mm:ss': 'csv.date-format.eu-dash-datetime',
};


export function getDateFormatOptions(): Array<{
  value: string;
  label: string;
}> {
  return DATE_FORMAT_VALUES.map((value) => ({
    value,
    label: t(DATE_FORMAT_KEYS[value]) || value,
  }));
}


export const TRADE_FIELDS = [
  
  'symbol',
  'direction',
  'entry_time',
  'exit_time',
  'entry_price',
  'exit_price',
  'quantity',
  'commission',
  'fees',
  'swap',
  'profit_loss',
  'notes',
  'thesis',
  'tags',
  'images',
  'setup_ids',
  'mistake',
  
  'asset_type', 
  
  'strike_price', 
  'expiration_date', 
  'option_type', 
  
  'contract_size', 
  
  'order_id', 
  'account_id', 
  'status', 
] as const;

export type TradeField = (typeof TRADE_FIELDS)[number];

export type ManualImportMode = 'price_based' | 'direct_pnl';


type LegacyColumnMappings = Record<string, string>;


export type MultiColumnMappings = Record<string, string[]>;


export type CSVColumnMappings =
  | LegacyColumnMappings
  | MultiColumnMappings
  | Record<string, string | string[]>;


export interface LocalCSVTemplate {
  
  id: string;

  
  name: string;

  
  broker_type: string;

  
  asset_type: 'stock' | 'options' | 'futures' | 'forex' | 'crypto';

  
  column_mappings: CSVColumnMappings;

  
  mapping_version?: 1 | 2;

  
  manual_mode?: ManualImportMode;

  
  date_format?: string;

  
  header_row_index?: number;

  
  delimiter?: string;

  
  has_headers: boolean;

  
  created_at: string;

  
  last_used?: string;

  
  usage_count: number;
}

export {};
