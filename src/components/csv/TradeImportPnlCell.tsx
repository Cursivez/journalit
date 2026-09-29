

import React from 'react';
import { PnLValue } from '../shared/display/DisplayValue';
import {
  classifyPnLWithBreakEvenSettings,
  type BreakEvenRangeSettings,
} from '../../utils/breakEvenRange';
import type { ClassifiedPreviewTrade } from '../../services/tradeImport/types';

export const TradeImportPnlCell: React.FC<{
  item: ClassifiedPreviewTrade;
  breakEven: BreakEvenRangeSettings;
  
  accountCurrency: string | undefined;
}> = ({ item, breakEven, accountCurrency }) => {
  const { preview, tradeData } = item;
  
  
  const value =
    typeof tradeData.authoritativePnl === 'number'
      ? tradeData.authoritativePnl
      : (preview.profitLoss ?? preview.directPnL);
  const outcome =
    typeof value === 'number' && Number.isFinite(value)
      ? classifyPnLWithBreakEvenSettings(value, breakEven)
      : 'unknown';
  const tone =
    outcome === 'win'
      ? 'positive'
      : outcome === 'loss'
        ? 'negative'
        : 'neutral';

  return (
    <PnLValue
      value={value}
      
      currencyCode={preview.currency ?? accountCurrency}
      fallback="—"
      tone={tone}
    />
  );
};
