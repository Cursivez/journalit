

import React from 'react';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import type { DisplayValueKind } from '../../../services/display/DisplayPolicy';
import { t, tPlural } from '../../../lang/helpers';
import type { FilterState } from '../dashboardTypes';
import {
  CompareBarChart,
  type CompareBarRow,
  CompareLegend,
} from './CompareCharts';


export const tradeCountNote = (
  count: number | undefined
): string | undefined =>
  count ? tPlural('dashboard.compare.trade-count', count) : undefined;


type CompareBarKind = 'pnl' | 'rMultiple' | 'winRate' | 'ratio' | 'count';

const MASK_KIND: Record<CompareBarKind, DisplayValueKind | null> = {
  pnl: 'pnl',
  rMultiple: 'rMultiple',
  winRate: 'returnPercent',
  ratio: 'metric',
  count: null,
};

const useCompareValueFormat = (kind: CompareBarKind, currencyCode: string) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const maskKind = MASK_KIND[kind];
  const format = (value: number): string => {
    switch (kind) {
      case 'pnl':
        return formatValue({ kind: 'pnl', value, currencyCode });
      case 'rMultiple':
        return formatValue({ kind: 'rMultiple', value, precision: 2 });
      case 'winRate':
        return formatValue({
          kind: 'returnPercent',
          value,
          signed: false,
          precision: 1,
        });
      case 'ratio':
        return formatValue({ kind: 'metric', value, precision: 2 });
      case 'count':
        return String(Math.round(value));
    }
  };
  return { format, masked: maskKind ? shouldMask(maskKind) : false };
};

interface CompareBarsWidgetProps {
  rows: readonly CompareBarRow[];
  kind: CompareBarKind;
  currencyCode: string;
  aFilters: FilterState;
  bFilters: FilterState;
  ariaLabel: string;
  orientation?: 'columns' | 'rows';
  formatCategory?: (label: string) => string;
  onCategoryClick?: (key: string) => void;
}

export const CompareBarsWidget: React.FC<CompareBarsWidgetProps> = ({
  rows,
  kind,
  currencyCode,
  aFilters,
  bFilters,
  ariaLabel,
  orientation,
  formatCategory,
  onCategoryClick,
}) => {
  const { format, masked } = useCompareValueFormat(kind, currencyCode);
  return (
    <div className="journalit-compare-widget">
      {rows.length === 0 ? (
        <div className="journalit-compare-widget__empty">
          {t('widget.empty.no-data')}
        </div>
      ) : (
        <CompareBarChart
          rows={rows}
          formatValue={format}
          masked={masked}
          orientation={orientation}
          formatCategory={formatCategory}
          ariaLabel={ariaLabel}
          onCategoryClick={masked ? undefined : onCategoryClick}
        />
      )}
      <CompareLegend aFilters={aFilters} bFilters={bFilters} />
    </div>
  );
};
