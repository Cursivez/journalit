import type { TradeData } from '../trade/TradeService';
import type { TradeImportPreviewTrade } from './types';

const toDate = (value?: string | null): Date | undefined =>
  value ? new Date(value) : undefined;
const definedNumber = (value?: number | null): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

export function mapPreviewTradeToTradeData(
  trade: TradeImportPreviewTrade,
  accountName: string,
  metadata?: {
    backendTradeId?: string;
    backendVersion?: number;
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
    direction: trade.direction,
    instrument: trade.symbol,
    tradeStatus: trade.status,
    account: [accountName],
    accountId: trade.accountId ?? metadata?.accountId ?? undefined,
    assetType: trade.assetType ?? undefined,
    setup: trade.setup ?? [],
    mistake: trade.mistake ?? [],
    images: trade.images ?? [],
    tags: trade.tags ?? [],
    customTags: trade.tags ?? [],
    commission: definedNumber(trade.commission),
    fees: definedNumber(trade.fees),
    swap: definedNumber(trade.swap),
    currency: trade.currency ?? undefined,
    brokerBaseCurrencyPnl: definedNumber(trade.brokerBaseCurrencyPnl),
    brokerBaseCurrency: trade.brokerBaseCurrency ?? undefined,
    brokerBaseCurrencyPnlSource: trade.brokerBaseCurrencyPnlSource ?? undefined,
    notes: trade.notes ?? undefined,
    thesis: trade.thesis ?? undefined,
    authoritativePnl: definedNumber(trade.profitLoss),
    useDirectPnLInput: trade.useDirectPnLInput,
    directPnL: definedNumber(trade.directPnL),
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
    tradeImportId: metadata?.backendTradeId,
    tradeImportVersion: metadata?.backendVersion,
    tradeImportAccountId: metadata?.accountId ?? undefined,
    tradeImportAccountBroker: metadata?.accountBroker ?? undefined,
    tradeImportAccountDisplayName: metadata?.accountDisplayName ?? undefined,
    customFields: trade.customFields,
    strikePrice: definedNumber(trade.strikePrice),
    expirationDate: toDate(trade.expirationDate),
    optionType: trade.optionType ?? undefined,
    contractSize: definedNumber(trade.contractSize),
    dollarPerPoint: definedNumber(trade.dollarPerPoint),
    tickSize: definedNumber(trade.tickSize),
    tickValue: definedNumber(trade.tickValue),
    lotSize: definedNumber(trade.lotSize),
    pipValue: definedNumber(trade.pipValue),
    pipSize: definedNumber(trade.pipSize),
    skipDefaultRiskAmount: true,
  };
}
