import { CustomFieldValues } from '../../../types/customFields';
import type { ImageAnnotations } from '../../../types/imageAnnotations';
import type { CanonicalProjectionClearField } from './CanonicalProjectionFields';

interface TradeExecutionInput {
  time: Date | string;
  price: number;
  size: number;
  notional?: number;
  hasExplicitPrice?: boolean;
}

interface TradeDividendInput {
  time: Date | string;
  amount: number;
}

interface IdealExitInput {
  time?: Date | string;
  price?: number;
  size?: number;
}

export interface TradeMutationInput {
  entries?: TradeExecutionInput[];
  exits?: TradeExecutionInput[];
  idealExits?: IdealExitInput[];
  dividends?: TradeDividendInput[];
  tradeStatus?: 'OPEN' | 'PARTIALLY_CLOSED' | 'CLOSED' | 'CANCELLED';
  openQuantity?: number;
  closedQuantity?: number;
  entryTime: Date | string;
  exitTime?: Date | string;
  entryPrice?: number;
  exitPrice?: number;
  positionSize?: number;
  hasExplicitExitPrice?: boolean;
  direction?: string;
  accountId?: string;
  thesis?: string;
  images?: string[];
  imageAnnotations?: ImageAnnotations;
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
  fxRate?: number;
  fxRateBaseCurrency?: string;
  brokerBaseCurrencyPnl?: number;
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  mae?: number;
  mfe?: number;
  maePrice?: number;
  mfePrice?: number;
  unrealizedPriceSnapshot?: number;
  unrealizedPriceSnapshotTime?: Date | string;
  exchange?: string;
  expirationDate?: Date | string;
  strikePrice?: number;
  optionType?: string;
  contractSize?: number;
  contractSymbol?: string;
  dollarPerPoint?: number;
  tickSize?: number;
  lastBrokerSyncAt?: string;
  tickValue?: number;
  lotSize?: number;
  pipValue?: number;
  pipSize?: number;
  forexQuoteCurrency?: string;
  forexPnlConversionRate?: number;
  forexPnlConversionBaseCurrency?: string;
  forexPnlConversionRateDate?: string;
  forexPnlConversionRateSource?: 'automatic' | 'manual';
  cryptoExchange?: string;
  leverageRatio?: number;
  lossReview?: unknown;
  tradeReview?: unknown;
  reviewed?: boolean;
  reviewedAt?: string;
  notes?: string;
  mtComment?: string;
  originalPnl?: number;
  originalRMultiple?: number;
  authoritativePnl?: number | null;
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
  tradeImportAccountId?: string;
  tradeImportAccountBroker?: string;
  tradeImportAccountDisplayName?: string;
  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionGeneration?: string;
  canonicalAccountId?: string;
  canonicalBroker?: string;
  canonicalAccountDisplayName?: string;
  canonicalProjectionSchemaVersion?: number;
  
  canonicalProjectionClearFields?: CanonicalProjectionClearField[];
  tradeId?: string;
  schemaVersion?: number;
  tradeRevision?: number;
  templateId?: string;
  templateVersion?: number;
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
