import React, { useMemo } from 'react';
import type JournalitPlugin from '../../../main';
import { applyTradeFilters } from '../../shared/filters/filterUtils';
import { useReviewData } from '../hooks/useReviewData';
import {
  TradeTableWidget,
  type TradeTableWidgetConfig,
} from './TradeTableWidget';
import type { TradesPreviewData } from '../../../types/reviewV2';
import { t } from '../../../lang/helpers';

const asObjectTrades = (value: unknown): Array<Record<string, unknown>> =>
  Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

interface BacktestTradesWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TradeTableWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

export const BacktestTradesWidget: React.FC<BacktestTradesWidgetProps> =
  React.memo(({ filePath, plugin, config, preview = false, previewData }) => {
    const { data, loading } = useReviewData(filePath, plugin);

    const backtestTrades = useMemo(() => {
      if (preview) {
        return asObjectTrades(previewData?.trades);
      }

      if (!data?.allTrades || !data.filters) {
        return [];
      }

      const customFieldDefinitions =
        plugin.customFieldsService?.getFields() || [];

      return applyTradeFilters(
        asObjectTrades(data.allTrades),
        {
          ...data.filters,
          tradeTypes: ['backtest'],
        },
        customFieldDefinitions,
        {
          resolveAccountIdDisplayName: (accountId) =>
            plugin.settings.backendIntegration?.accountMapping?.[accountId],
        }
      );
    }, [data, plugin, preview, previewData]);

    return (
      <TradeTableWidget
        filePath={filePath}
        plugin={plugin}
        config={config}
        preview={preview}
        tradesOverride={backtestTrades}
        loadingOverride={preview ? false : loading}
        emptyMessage={t('widget.backtest-trades.empty')}
      />
    );
  });

BacktestTradesWidget.displayName = 'BacktestTradesWidget';
