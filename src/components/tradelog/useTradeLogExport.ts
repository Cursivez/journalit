import { useCallback, useEffect, useRef, useState } from 'react';
import { Notice, type WorkspaceLeaf } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import type { TradeLogService } from '../../services/tradelog/TradeLogService';
import type { TradeLogFilters } from '../../services/tradelog/types';
import type { ColumnDefinition } from './columnConfig';
import { applySorting, type SortConfig } from './sortUtils';
import { queryTradeLog } from './tradeLogQuery';
import { buildTradeLogExport } from './tradeLogExport';
import { offerTradeLogExport } from './saveTradeLogExport';
import { CurrencyCode } from '../../utils/currencyConfig';

export function useTradeLogExport({
  plugin,
  leaf,
  tradeLogService,
  filters,
  operationFilePaths,
  visibleColumns,
  allColumns,
  sortConfig,
  snapshotKeysClaimedByCustomFields,
}: {
  plugin: JournalitPlugin;
  leaf: WorkspaceLeaf;
  tradeLogService: TradeLogService;
  filters: TradeLogFilters;
  operationFilePaths?: string[];
  visibleColumns: ColumnDefinition[];
  allColumns: ColumnDefinition[];
  sortConfig: SortConfig;
  snapshotKeysClaimedByCustomFields: boolean;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  useEffect(() => () => controllerRef.current?.abort(), []);
  const tradeSettings = plugin.settings.trade;
  const defaultCurrency = plugin.settings.general?.currency || CurrencyCode.USD;

  const handleExport = useCallback(async () => {
    if (controllerRef.current) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsExporting(true);
    
    const settingsSnapshot = { ...tradeSettings };
    try {
      const data = await queryTradeLog(
        tradeLogService,
        filters,
        operationFilePaths,
        'trades'
      );
      if (controller.signal.aborted) return;
      const exportNodes =
        filters.viewLevel === 'trades'
          ? applySorting(
              data,
              sortConfig,
              settingsSnapshot.defaultRiskAmount,
              allColumns,
              snapshotKeysClaimedByCustomFields,
              settingsSnapshot.maeMfeDisplayUnit
            )
          : data;
      const table = buildTradeLogExport(exportNodes, visibleColumns, {
        tradeSettings: settingsSnapshot,
        defaultCurrency,
        snapshotKeysClaimedByCustomFields,
      });
      await offerTradeLogExport(
        plugin.app,
        leaf.view.containerEl.ownerDocument,
        table,
        controller.signal
      );
    } catch (error) {
      console.error('Failed to export Trade Log:', error);
      if (!controller.signal.aborted) new Notice(t('tradelog.export.failed'));
    } finally {
      controllerRef.current = null;
      setIsExporting(false);
    }
  }, [
    plugin.app,
    leaf,
    tradeLogService,
    filters,
    operationFilePaths,
    visibleColumns,
    allColumns,
    sortConfig,
    snapshotKeysClaimedByCustomFields,
    tradeSettings,
    defaultCurrency,
  ]);

  return { handleExport, isExporting };
}
