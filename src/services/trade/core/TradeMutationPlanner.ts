import {
  planTradeRelocation,
  normalizeTradePathDate,
  sanitizeTradeSymbolForFilename,
} from './TradePathPolicy';
import {
  applyDefaultRiskAmount,
  calculateTradeMutationFinancials,
  validateAndNormalizeTradeMutationInput,
} from './TradeRules';
import {
  ExistingTradePathContext,
  TradeMutationInput,
  TradeMutationPlan,
} from './types';

export function planTradeMutation<TData extends TradeMutationInput>(params: {
  mode: 'create' | 'update';
  data: TData;
  defaultRiskAmount?: number;
  financialFieldsChanged?: boolean;
  existingPathContext?: ExistingTradePathContext;
}): TradeMutationPlan<TData> {
  const validation = validateAndNormalizeTradeMutationInput(params.data, {
    allowClosedTradeWithoutExitTimeInDirectPnlMode: true,
  });
  const normalizedData = applyDefaultRiskAmount(
    validation.normalizedData,
    params.defaultRiskAmount
  );
  const financials = calculateTradeMutationFinancials(normalizedData, {
    isOpen: validation.isOpen,
    financialFieldsChanged: params.financialFieldsChanged,
  });

  const normalizedEntryTime = normalizeTradePathDate(normalizedData.entryTime);
  const normalizedTicker = sanitizeTradeSymbolForFilename(
    normalizedData.instrument || 'UNKNOWN'
  );

  return {
    normalizedData,
    isOpen: validation.isOpen,
    pnl: financials.pnl,
    rMultiple: financials.rMultiple,
    normalizedEntryTime,
    normalizedTicker,
    relocation: params.existingPathContext
      ? planTradeRelocation({
          current: params.existingPathContext,
          nextEntryTime: normalizedData.entryTime,
          nextInstrument: normalizedData.instrument,
        })
      : undefined,
  };
}
