import { CustomFieldValues } from '../../../types/customFields';

export interface TradeExecutionInput {
  time: Date | string;
  price: number;
  size: number;
  notional?: number;
  hasExplicitPrice?: boolean;
}

export interface TradeDividendInput {
  time: Date | string;
  amount: number;
}

export interface TradeMutationInput {
  entries?: TradeExecutionInput[];
  exits?: TradeExecutionInput[];
  dividends?: TradeDividendInput[];
  tradeStatus?: 'OPEN' | 'CLOSED';
  entryTime: Date | string;
  exitTime?: Date | string;
  entryPrice?: number;
  exitPrice?: number;
  positionSize?: number;
  hasExplicitExitPrice?: boolean;
  direction?: string;
  setupIds?: string[];
  accountId?: string;
  thesis?: string;
  images?: string[];
  instrument?: string;
  assetType?: string;
  account?: string[];
  setup?: string[];
  mistake?: string[];
  customTags?: string[];
  tags?: string[];
  commission?: number;
  hasExplicitCommission?: boolean;
  commissionType?: 'fixed' | 'percentage';
  swap?: number;
  fees?: number;
  rebate?: number;
  stopLoss?: number;
  takeProfits?: Array<{
    price?: number;
    closePercent?: number;
  }>;
  riskAmount?: number;
  currency?: string;
  brokerBaseCurrencyPnl?: number;
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  mae?: number;
  mfe?: number;
  maePrice?: number;
  mfePrice?: number;
  exchange?: string;
  expirationDate?: Date | string;
  strikePrice?: number;
  optionType?: string;
  contractSize?: number;
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
  lotSize?: number;
  pipValue?: number;
  pipSize?: number;
  cryptoExchange?: string;
  leverageRatio?: number;
  lossReview?: unknown;
  reviewed?: boolean;
  reviewedAt?: string;
  notes?: string;
  mtComment?: string;
  originalPnl?: number;
  originalRMultiple?: number;
  authoritativePnl?: number;
  skipDefaultRiskAmount?: boolean;
  useDirectPnLInput?: boolean;
  directPnL?: number;
  executionLedgerVersion?: number;
  executionIds?: string[];
  sourceRows?: number[];
  orderId?: string;
  backendTradeId?: number;
  tradeImportId?: string;
  tradeImportVersion?: number;
  tradeId?: string;
  schemaVersion?: number;
  tradeRevision?: number;
  customFields?: CustomFieldValues;
  [key: string]: unknown;
}

export interface ExistingTradePathContext {
  filePath: string;
  existingEntryTime?: Date | string | null;
  existingTicker?: string;
  existingType?: string;
  isMissedTrade?: boolean;
}

export interface TradeMutationPlan<
  TData extends TradeMutationInput = TradeMutationInput,
> {
  normalizedData: TData;
  isOpen: boolean;
  pnl: number | null;
  rMultiple: number | null;
  normalizedEntryTime: Date;
  normalizedTicker: string;
  relocation?: {
    required: boolean;
    dateChanged: boolean;
    tickerChanged: boolean;
    needsRegularTradePath: boolean;
  };
}
