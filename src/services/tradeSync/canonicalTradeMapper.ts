import type { TradeData } from '../trade/TradeService';
import type { TradeImportPreviewTrade } from '../tradeImport/types';

const toDate = (value?: string | null): Date | undefined =>
  value ? new Date(value) : undefined;
const definedNumber = (value?: number | null): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

export function mapProjectionTradeToTradeData(
  trade: TradeImportPreviewTrade,
  accountName: string,
  metadata?: {
    backendTradeId?: string;
    backendVersion?: number;
    projectionGeneration?: string;
    accountId?: string | null;
    accountBroker?: string | null;
    accountDisplayName?: string | null;
  }
): TradeData {
  return {
    entryTime: new Date(trade.entryTime),
    exitTime: toDate(trade.exitTime),
    entryPrice: trade.entryPrice,
    exitPrice: definedNumber(trade.exitPrice),
    hasExplicitExitPrice:
      trade.exitPrice !== null && trade.exitPrice !== undefined,
    positionSize: trade.quantity,
    openQuantity: trade.openQuantity,
    closedQuantity: trade.closedQuantity,
    direction: trade.direction,
    instrument: trade.symbol,
    tradeStatus: trade.status,
    account: [accountName],

    assetType: trade.assetType ?? undefined,
    exchange: trade.exchange ?? undefined,
    underlyingSymbol: trade.underlyingSymbol ?? undefined,
    setup: trade.setup ?? [],
    mistake: trade.mistake ?? [],
    images: trade.images ?? [],
    tags: trade.tags ?? [],
    customTags: trade.tags ?? [],
    commission: definedNumber(trade.commission),
    fees: definedNumber(trade.fees),
    swap: definedNumber(trade.swap),
    hasExplicitCommission:
      trade.commission !== null && trade.commission !== undefined,
    currency: trade.currency ?? undefined,
    brokerBaseCurrencyPnl: definedNumber(trade.brokerBaseCurrencyPnl),
    brokerBaseCurrency: trade.brokerBaseCurrency ?? undefined,
    brokerBaseCurrencyPnlSource: trade.brokerBaseCurrencyPnlSource ?? undefined,
    mtComment: trade.brokerComment?.trim() || undefined,
    notes: trade.notes ?? undefined,
    thesis: trade.thesis ?? undefined,
    authoritativePnl:
      trade.profitLoss === null ? null : definedNumber(trade.profitLoss),
    useDirectPnLInput: trade.useDirectPnLInput,
    
    
    
    directPnL:
      trade.profitLoss === null
        ? undefined
        : definedNumber(trade.grossProfitLoss ?? trade.directPnL),
    entries: trade.entries?.map((entry) => ({
      time: new Date(entry.time),
      price: entry.price,
      size: entry.size,
    })),
    exits: trade.exits?.map((exit) => ({
      time: new Date(exit.time),
      price: exit.price,
      size: exit.size,
    })),
    executionLedgerVersion: trade.executionLedgerVersion ?? undefined,
    executionIds: trade.executionIds,
    sourceRows: trade.sourceRows,
    orderId: trade.orderId ?? undefined,
    canonicalTradeId: metadata?.backendTradeId,
    canonicalTradeVersion: metadata?.backendVersion,
    canonicalProjectionGeneration: metadata?.projectionGeneration,
    canonicalAccountId: metadata?.accountId ?? undefined,
    canonicalBroker: metadata?.accountBroker ?? undefined,
    canonicalAccountDisplayName: metadata?.accountDisplayName ?? undefined,
    canonicalProjectionSchemaVersion: 1,
    customFields: trade.customFields,
    strikePrice: definedNumber(trade.strikePrice),
    expirationDate: toDate(trade.expirationDate),
    optionType: trade.optionType ?? undefined,
    contractSize: definedNumber(trade.contractSize),
    contractSymbol: trade.brokerContract ?? undefined,
    dollarPerPoint: definedNumber(trade.dollarPerPoint),
    tickSize: definedNumber(trade.tickSize),
    lastBrokerSyncAt: trade.lastBrokerSyncAt ?? undefined,
    tickValue: definedNumber(trade.tickValue),
    lotSize: definedNumber(trade.lotSize),
    pipValue: definedNumber(trade.pipValue),
    pipSize: definedNumber(trade.pipSize),
    currencyPair: trade.currencyPair ?? undefined,
    tradingPair: trade.tradingPair ?? undefined,
    cryptoExchange: trade.cryptoExchange ?? undefined,
    leverageRatio: definedNumber(trade.leverageRatio),
    skipDefaultRiskAmount: true,
  };
}
