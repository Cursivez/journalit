

import { ReactNode } from 'react';
import { LossReviewData } from '../../../services/backend/types';
import { CustomFieldValues } from '../../../types/customFields';
import type { TradeId } from '../../../utils/tradeIdentity';


export enum AssetType {
  STOCK = 'stock',
  OPTIONS = 'options',
  FUTURES = 'futures',
  FOREX = 'forex',
  CRYPTO = 'crypto',
  CFD = 'cfd',
}

function supportsTradeDividends(assetType?: string): boolean {
  return assetType === AssetType.STOCK || assetType === AssetType.CFD;
}

export function shouldShowTradeDividends(data: {
  assetType?: string;
  isMissedTrade?: boolean;
  isBacktestTrade?: boolean;
}): boolean {
  return (
    !data.isMissedTrade &&
    !data.isBacktestTrade &&
    supportsTradeDividends(data.assetType)
  );
}


export interface EntryTransaction {
  
  time?: Date;
  
  blankTimeDate?: Date;
  
  price?: number;
  
  size?: number;
  
  notional?: number;
}


export interface ExitTransaction {
  
  time?: Date;
  
  blankTimeDate?: Date;
  
  price?: number;
  
  size?: number;
  
  notional?: number;
  
  hasExplicitPrice?: boolean;
}


export interface DividendTransaction {
  
  time: Date;
  
  amount: number;
}

export interface TakeProfitTarget {
  clientId?: string;
  price?: number;
  closePercent?: number;
}


export interface TradeFormData {
  
  entries?: EntryTransaction[];
  
  exits?: ExitTransaction[];
  
  dividends?: DividendTransaction[];

  
  entryTime: Date;
  
  exitTime: Date;
  
  entryPrice: number;
  
  exitPrice: number;
  
  hasExplicitExitPrice?: boolean;
  
  positionSize: number;
  
  direction: string;
  
  instrument: string;
  
  assetType: string;
  
  setupIds: string[];
  
  
  thesis?: string;
  
  images?: string[];
  
  customTags?: string[];
  
  tags?: string[];
  
  setup?: string[];
  
  mistake?: string[];
  
  account?: string[];
  
  accountId?: string;
  
  filePath?: string;
  
  pnl?: number;
  
  currency?: string;
  
  useDirectPnLInput?: boolean;
  
  directPnL?: number;
  
  commission?: number;
  
  hasExplicitCommission?: boolean;
  
  commissionType?: 'fixed' | 'percentage';
  
  swap?: number;
  
  fees?: number;
  
  rebate?: number;
  
  stopLoss?: number;
  
  takeProfits?: TakeProfitTarget[];
  
  riskAmount?: number;
  
  rMultiple?: number;
  
  mae?: number;
  
  mfe?: number;
  
  maePrice?: number;
  
  mfePrice?: number;

  
  
  exchange?: string;

  
  
  expirationDate?: Date;
  
  strikePrice?: number;
  
  optionType?: 'call' | 'put';
  
  contractSize?: number;

  
  
  contractSymbol?: string;
  
  dollarPerPoint?: number;
  
  tickSize?: number;
  
  tickValue?: number;

  
  
  currencyPair?: string;
  
  lotSize?: number;
  
  pipValue?: number;

  
  
  tradingPair?: string;
  
  cryptoExchange?: string;

  
  
  leverageRatio?: number;

  
  
  lossReview?: LossReviewData;

  
  
  reviewed?: boolean;
  
  reviewedAt?: string;

  
  
  isMissedTrade?: boolean;
  
  type?: string;
  
  missedReason?: string;

  
  
  isBacktestTrade?: boolean;

  
  
  tradeId?: TradeId;
  
  schemaVersion?: number;
  
  backendTradeId?: number;
  
  originalPnl?: number;

  
  
  customFields?: CustomFieldValues;

  
  tradeStatus?: string;

  
  notes?: string;
  
  mtComment?: string;

  
  [key: string]: unknown;
}


export type TradeFormValue = TradeFormData[keyof TradeFormData];


export const DEFAULT_TRADE_FORM_DATA: TradeFormData = {
  entries: [
    {
      time: undefined,
      price: 0,
      size: 0,
    },
  ],
  exits: [
    {
      time: undefined,
      price: 0,
      size: 0,
    },
  ],
  dividends: [],
  entryTime: new Date(),
  exitTime: new Date(),
  entryPrice: 0, 
  exitPrice: 0, 
  positionSize: 0, 
  direction: '', 
  instrument: '',
  assetType: '', 
  setupIds: [], 
  thesis: '',
  images: [],
  customTags: [],
  tags: [], 
  
  setup: [],
  mistake: [],
  account: [],
  filePath: '',
  pnl: 0, 
  useDirectPnLInput: false, 
  directPnL: 0, 
  commission: 0, 
  commissionType: 'fixed', 
  swap: 0, 
  fees: 0, 
  rebate: undefined, 
  stopLoss: undefined,
  takeProfits: [],
  riskAmount: undefined,
  rMultiple: undefined,

  
  exchange: '',

  
  expirationDate: new Date(),
  strikePrice: 0,
  optionType: 'call',
  contractSize: 100,

  
  contractSymbol: '',
  dollarPerPoint: 0, 
  tickSize: 0,
  tickValue: 0,

  
  currencyPair: '',
  lotSize: 0,
  pipValue: 0,

  
  tradingPair: '',
  cryptoExchange: '',

  
  leverageRatio: 0,

  
  isMissedTrade: false,
  missedReason: '',

  
  isBacktestTrade: false,

  
  customFields: {},
};


export interface TradeFormProps {
  
  initialData?: Partial<TradeFormData>;
  
  isSubmitting?: boolean;
  
  isEditMode?: boolean;
  
  onSubmit?: (data: TradeFormData) => Promise<boolean> | boolean;
  
  onCancel?: () => void;
  
  onDirtyStateChange?: (isDirtyFn: () => boolean) => void;
}


export interface FormSectionProps {
  
  title: string;
  
  children: ReactNode;
  
  description?: string;
}


export interface TradeFormErrors {
  
  entries?: Array<{ time?: string; price?: string; size?: string }>;
  
  exits?: Array<{ time?: string; price?: string; size?: string }>;
  
  dividends?: Array<{ time?: string; amount?: string }>;
  
  entriesExits?: string;

  entryTime?: string;
  exitTime?: string;
  entryPrice?: string;
  exitPrice?: string;
  positionSize?: string;
  direction?: string;
  instrument?: string;
  assetType?: string;
  setupIds?: string;
  account?: string;
  form?: string;
  directPnL?: string;
  commission?: string;
  commissionType?: string;
  swap?: string;
  fees?: string;
  rebate?: string;
  stopLoss?: string;
  takeProfits?: Array<{
    price?: string;
    closePercent?: string;
  }>;
  riskAmount?: string;
  mae?: string;
  mfe?: string;
  maePrice?: string;
  mfePrice?: string;

  
  exchange?: string;

  
  expirationDate?: string;
  strikePrice?: string;
  optionType?: string;
  contractSize?: string;

  
  contractSymbol?: string;
  dollarPerPoint?: string;
  tickSize?: string;
  tickValue?: string;

  
  currencyPair?: string;
  lotSize?: string;
  pipValue?: string;

  
  tradingPair?: string;
  cryptoExchange?: string;

  
  leverageRatio?: string;

  
  customFields?: { [fieldId: string]: string };
}
