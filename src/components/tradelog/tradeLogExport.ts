import type { TimeNode, TradeLogTrade } from '../../services/tradelog/types';
import type {
  MaeMfeDisplayUnit,
  JournalitSettings,
} from '../../settings/types';
import { CustomFieldType } from '../../types/customFields';
import {
  formatLocalDateTime,
  parseStoredDateLikeValue,
} from '../../utils/customFieldPersistence';
import { t } from '../../lang/helpers';
import { formatLocalDateString, getDaysToExpiry } from '../../utils/dateUtils';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import { calculateTotalDividends } from '../../utils/pnlCalculation';
import {
  calculateStopLossRiskAmount,
  canCalculateStopLossRiskAmount,
  resolveTradeEffectiveStopPrice,
  resolveTradeRiskAmount,
} from '../../utils/riskCalculation';
import { isPricedStopLoss } from '../../services/trade/core/StopLossTargets';
import { getTradeDirectionDisplayKind } from '../../services/trade/core/TradeDirection';
import {
  calculateTradePriceMove,
  getFirstEntryTime,
  getLastExitTime,
  getResolvedWeightedAverageExitPrice,
  getTotalEntrySize,
  getTradeDisplayStatusWithContext,
  getWeightedAverageEntryPrice,
  isTradeOpenWithContext,
} from '../../utils/tradeStatusUtils';
import {
  getTradeMaeTicks,
  getTradeMaeValue,
  getTradeMfeTicks,
  getTradeMfeValue,
} from '../../utils/tradeExcursion';
import { getColumnLabel, type ColumnDefinition } from './columnConfig';
import {
  getCustomFieldDisplayValues,
  getCustomFieldRawValue,
} from './customFieldDisplay';
import { getTradeLogDisplayedPnL, getTradeLogPnlValue } from './tradeLogPnl';
import {
  calculateTradeMaxR,
  calculateTradeReturnPercent,
  getMaeMfePercent,
} from './tradeMetricUtils';

export type TradeLogExportFormat = 'csv' | 'json' | 'md';
type ExportValue = string | number | boolean | null | string[];
interface ExportColumn {
  id: string;
  label: string;
}
export interface TradeLogExportTable {
  columns: ExportColumn[];
  rows: Record<string, ExportValue>[];
}
interface ExportOptions {
  tradeSettings: JournalitSettings['trade'];
  defaultCurrency: string;
  snapshotKeysClaimedByCustomFields: boolean;
  now?: Date;
}



function scalarValue(value: unknown): string | number | boolean | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  return null;
}

function customValue(
  trade: TradeLogTrade,
  column: ColumnDefinition
): ExportValue {
  const field = column.customField;
  if (!field) throw new Error(`Missing custom field definition: ${column.id}`);
  const raw = getCustomFieldRawValue(trade, field);
  if (raw === undefined || raw === null || raw === '') return null;
  switch (field.type) {
    case CustomFieldType.NUMBER:
      return scalarValue(Number(raw));
    case CustomFieldType.DROPDOWN:
      return getCustomFieldDisplayValues(field, raw)[0] ?? null;
    case CustomFieldType.MULTISELECT:
      return getCustomFieldDisplayValues(field, raw);
    case CustomFieldType.DATE: {
      const date = parseStoredDateLikeValue(raw);
      return date ? formatLocalDateString(date) : null;
    }
    case CustomFieldType.DATETIME: {
      const date = parseStoredDateLikeValue(raw, { includeTime: true });
      return date ? formatLocalDateTime(date) : null;
    }
    case CustomFieldType.TIME:
      return (
        parseStoredDateLikeValue(raw, { timeOnly: true })
          ?.toTimeString()
          .slice(0, 8) ?? null
      );
    case CustomFieldType.TEXT:
      return scalarValue(raw);
  }
}

function columnValue(
  trade: TradeLogTrade,
  column: ColumnDefinition,
  options: ExportOptions,
  now: Date
): ExportValue {
  if (column.customField) return customValue(trade, column);
  const entry = () => getWeightedAverageEntryPrice(trade);
  const pnl = () =>
    getTradeLogPnlValue(trade, options.snapshotKeysClaimedByCustomFields);
  const list = (value: string | string[] | undefined): string[] =>
    typeof value === 'string' ? [value] : (value ?? []);
  switch (column.id) {
    case 'image':
      return trade.images ?? [];
    case 'account':
      return list(trade.account);
    case 'ticker':
      return trade.instrument ?? null;
    case 'exchange':
      return trade.exchange || trade.cryptoExchange || null;
    case 'status':
      return getTradeDisplayStatusWithContext(
        trade,
        options.tradeSettings,
        () =>
          getTradeLogDisplayedPnL(
            trade,
            options.snapshotKeysClaimedByCustomFields
          )
      );
    case 'direction':
      return getTradeDirectionDisplayKind(trade);
    case 'date': {
      const date = getFirstEntryTime(trade);
      return date ? formatLocalDateString(date) : null;
    }
    case 'exitDate': {
      const date = getLastExitTime(trade);
      return date ? formatLocalDateString(date) : null;
    }
    case 'entryTime':
      return getFirstEntryTime(trade)?.toISOString() ?? null;
    case 'exitTime':
      return getLastExitTime(trade)?.toISOString() ?? null;
    case 'duration': {
      const start = getFirstEntryTime(trade);
      const end = isTradeOpenWithContext(trade) ? now : getLastExitTime(trade);
      return start && end ? (end.getTime() - start.getTime()) / 1000 : null;
    }
    case 'expirationDate': {
      const date = parseStoredDateLikeValue(trade.expirationDate);
      return trade.assetType === 'options' && date
        ? formatLocalDateString(date)
        : null;
    }
    case 'daysToExpiry':
      return trade.assetType === 'options' && trade.expirationDate
        ? getDaysToExpiry(trade.expirationDate)
        : null;
    case 'entryPrice':
      return entry();
    case 'exitPrice':
      return getResolvedWeightedAverageExitPrice(trade);
    case 'priceMove':
      return calculateTradePriceMove(trade);
    case 'stopLoss':
      
      return trade.stopLosses?.find(isPricedStopLoss)?.price ?? null;
    case 'slDistanceDollar':
      return canCalculateStopLossRiskAmount(trade)
        ? calculateStopLossRiskAmount(trade)
        : null;
    case 'slDistancePercent': {
      const price = entry();
      const stopPrice = resolveTradeEffectiveStopPrice(trade);
      return price && stopPrice !== undefined
        ? Math.abs((price - stopPrice) / price) * 100
        : null;
    }
    case 'riskAmount':
      return resolveTradeRiskAmount(trade) ?? null;
    case 'rMultiple': {
      const value = pnl();
      return value === null
        ? null
        : (calculateEffectiveRMultiple(
            value,
            isTradeOpenWithContext(trade) ? undefined : trade.rMultiple,
            trade.riskAmount,
            options.tradeSettings.defaultRiskAmount
          ) ?? null);
    }
    case 'maxR':
      return (
        calculateTradeMaxR(trade, options.tradeSettings.defaultRiskAmount) ??
        null
      );
    case 'maePrice':
      return trade.maePrice ?? null;
    case 'mfePrice':
      return trade.mfePrice ?? null;
    case 'mae':
      return (
        (options.tradeSettings.maeMfeDisplayUnit === 'ticks'
          ? getTradeMaeTicks(trade)
          : getTradeMaeValue(trade)) ?? null
      );
    case 'mfe':
      return (
        (options.tradeSettings.maeMfeDisplayUnit === 'ticks'
          ? getTradeMfeTicks(trade)
          : getTradeMfeValue(trade)) ?? null
      );
    case 'maePercent':
      return getMaeMfePercent(trade, 'mae', 'maePrice');
    case 'mfePercent':
      return getMaeMfePercent(trade, 'mfe', 'mfePrice');
    case 'positionSize':
      return getTotalEntrySize(trade);
    case 'positionValue': {
      const price = entry();
      const size = getTotalEntrySize(trade);
      return price !== null && size !== null ? price * size : null;
    }
    case 'fees':
      if (trade._analyticsEventContext?.ownsSourceCashflows === false) return 0;
      return (trade.fees ?? 0) + (trade.commission ?? 0) + (trade.swap ?? 0);
    case 'dividends':
      if (trade._analyticsEventContext?.ownsSourceCashflows === false) return 0;
      return calculateTotalDividends(trade);
    case 'pnl':
      return pnl();
    case 'returnPercent':
      return calculateTradeReturnPercent(trade) ?? null;
    case 'setups':
      return list(trade.setup);
    case 'mistakes':
      return list(trade.mistake);
    case 'tags':
      return trade.tags ?? [];
    case 'reviewed':
      return trade.reviewed === true;
    case 'thesis':
      return trade.thesis ?? null;
    case 'mtComment':
      return trade.mtComment ?? null;
    default:
      throw new Error(`Unsupported export column: ${column.id}`);
  }
}

function exportLabel(
  column: ColumnDefinition,
  unit: MaeMfeDisplayUnit
): string {
  const label = getColumnLabel(column);
  if (column.id === 'duration') return `${label} (s)`;
  if (column.id === 'entryTime' || column.id === 'exitTime')
    return `${label} (ISO 8601)`;
  if ((column.id === 'mae' || column.id === 'mfe') && unit === 'ticks')
    return `${label} (ticks)`;
  return label;
}


export function buildTradeLogExport(
  nodes: TimeNode[],
  visibleColumns: ColumnDefinition[],
  options: ExportOptions
): TradeLogExportTable {
  const columns = visibleColumns.filter((column) => column.id !== 'select');
  const includeCurrency = columns.some((column) => {
    if (column.customField)
      return (
        column.customField.type === CustomFieldType.NUMBER &&
        column.customField.tradeLog?.displayAsCurrency === true
      );
    if (column.id === 'mae' || column.id === 'mfe')
      return options.tradeSettings.maeMfeDisplayUnit !== 'ticks';
    return column.type === 'currency' || column.id === 'priceMove';
  });
  const now = options.now ?? new Date();
  return {
    columns: [
      ...columns.map((column) => ({
        id: column.id,
        label: exportLabel(
          column,
          options.tradeSettings.maeMfeDisplayUnit ?? 'dollar'
        ),
      })),
      ...(includeCurrency
        ? [{ id: 'currency', label: t('settings.general.currency') }]
        : []),
    ],
    rows: nodes.flatMap((node) => {
      const trade = node.trade;
      if (node.type !== 'trade' || !trade) return [];
      const row: Record<string, ExportValue> = {};
      for (const column of columns) {
        row[column.id] = columnValue(trade, column, options, now);
      }
      if (includeCurrency)
        row.currency = trade.currency || options.defaultCurrency;
      return [row];
    }),
  };
}

function textValue(value: ExportValue): string {
  return Array.isArray(value)
    ? JSON.stringify(value)
    : value === null
      ? ''
      : String(value);
}

function csvCell(value: ExportValue): string {
  let text = textValue(value);
  
  
  if (
    typeof value === 'string' &&
    /^[\s\p{Cc}]*[=+\-@＝＋－＠]|^[\t\r\n]/u.test(text)
  )
    text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function markdownCell(value: ExportValue): string {
  return textValue(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/([\\`*_[\]{}!#])/g, '\\$1')
    .replace(/\|/g, '&#124;')
    .replace(/\r\n|\r|\n/g, '<br>');
}

export function serializeTradeLogExport(
  table: TradeLogExportTable,
  format: TradeLogExportFormat
): { content: string; mimeType: string } {
  if (format === 'json')
    return {
      content: JSON.stringify(table, null, 2),
      mimeType: 'application/json;charset=utf-8',
    };
  const values = [
    table.columns.map((column) => column.label),
    ...table.rows.map((row) => table.columns.map((column) => row[column.id])),
  ];
  if (format === 'csv')
    return {
      content:
        '\uFEFF' +
        values.map((row) => row.map(csvCell).join(',')).join('\r\n') +
        '\r\n',
      mimeType: 'text/csv;charset=utf-8',
    };
  const rows = values.map((row) => `| ${row.map(markdownCell).join(' | ')} |`);
  rows.splice(1, 0, `| ${table.columns.map(() => '---').join(' | ')} |`);
  return {
    content: rows.join('\n') + '\n',
    mimeType: 'text/markdown;charset=utf-8',
  };
}
