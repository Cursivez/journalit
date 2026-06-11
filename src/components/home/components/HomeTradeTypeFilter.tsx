

import React from 'react';
import type { TradeType } from '../../../services/tradelog/types';
import { RegularBacktestTradeTypeFilter } from '../../shared/RegularBacktestTradeTypeFilter';

interface HomeTradeTypeFilterProps {
  selectedTradeTypes: TradeType[];
  onChange: (tradeTypes: TradeType[]) => void | Promise<void>;
}

export const HomeTradeTypeFilter: React.FC<HomeTradeTypeFilterProps> =
  React.memo(({ selectedTradeTypes, onChange }) => (
    <RegularBacktestTradeTypeFilter
      selectedTradeTypes={selectedTradeTypes}
      onChange={onChange}
    />
  ));

HomeTradeTypeFilter.displayName = 'HomeTradeTypeFilter';
