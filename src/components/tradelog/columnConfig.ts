

import { hasTranslation, t } from '../../lang/helpers';
import {
  TradeLogColumnId,
  CustomTradeLogColumnId,
  TradeLogSettings,
  DEFAULT_SETTINGS,
} from '../../settings/types';
import {
  CustomFieldDefinition,
  CustomFieldType,
} from '../../types/customFields';

const CUSTOM_TRADE_LOG_COLUMN_PREFIX = 'cf:';

export type ColumnType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'time'
  | 'duration'
  | 'image'
  | 'boolean'
  | 'percentage';

export type ColumnCategory =
  | 'basic'
  | 'timing'
  | 'prices'
  | 'risk'
  | 'position'
  | 'review'
  | 'custom';

export interface ColumnDefinition {
  id: TradeLogColumnId;
  width: number;
  sortable: boolean;
  defaultVisible: boolean;
  type: ColumnType;
  category: ColumnCategory;
  customField?: CustomFieldDefinition;
}

export const COLUMN_CATEGORIES: { id: ColumnCategory }[] = [
  { id: 'basic' },
  { id: 'timing' },
  { id: 'prices' },
  { id: 'risk' },
  { id: 'position' },
  { id: 'review' },
  { id: 'custom' },
];

const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  
  {
    id: 'select',
    width: 40,
    sortable: false,
    defaultVisible: false,
    type: 'text',
    category: 'basic',
  },
  {
    id: 'image',
    width: 50,
    sortable: false,
    defaultVisible: true,
    type: 'image',
    category: 'basic',
  },
  {
    id: 'account',
    width: 100,
    sortable: false,
    defaultVisible: true,
    type: 'text',
    category: 'basic',
  },
  {
    id: 'ticker',
    width: 120,
    sortable: false,
    defaultVisible: true,
    type: 'text',
    category: 'basic',
  },
  {
    id: 'exchange',
    width: 100,
    sortable: false,
    defaultVisible: false,
    type: 'text',
    category: 'basic',
  },
  {
    id: 'status',
    width: 100,
    sortable: false,
    defaultVisible: true,
    type: 'text',
    category: 'basic',
  },
  {
    id: 'direction',
    width: 100,
    sortable: false,
    defaultVisible: true,
    type: 'text',
    category: 'basic',
  },

  
  {
    id: 'date',
    width: 100,
    sortable: true,
    defaultVisible: true,
    type: 'date',
    category: 'timing',
  },
  {
    id: 'entryTime',
    width: 90,
    sortable: false,
    defaultVisible: false,
    type: 'text',
    category: 'timing',
  },
  {
    id: 'exitDate',
    width: 100,
    sortable: true,
    defaultVisible: false,
    type: 'date',
    category: 'timing',
  },
  {
    id: 'exitTime',
    width: 90,
    sortable: false,
    defaultVisible: false,
    type: 'text',
    category: 'timing',
  },
  {
    id: 'duration',
    width: 120,
    sortable: true,
    defaultVisible: false,
    type: 'duration',
    category: 'timing',
  },
  {
    id: 'expirationDate',
    width: 110,
    sortable: true,
    defaultVisible: false,
    type: 'date',
    category: 'timing',
  },
  {
    id: 'daysToExpiry',
    width: 80,
    sortable: true,
    defaultVisible: false,
    type: 'number',
    category: 'timing',
  },

  
  {
    id: 'entryPrice',
    width: 100,
    sortable: false,
    defaultVisible: false,
    type: 'currency',
    category: 'prices',
  },
  {
    id: 'exitPrice',
    width: 100,
    sortable: false,
    defaultVisible: false,
    type: 'currency',
    category: 'prices',
  },
  {
    id: 'priceMove',
    width: 110,
    sortable: true,
    defaultVisible: false,
    type: 'number',
    category: 'prices',
  },
  {
    id: 'stopLoss',
    width: 100,
    sortable: false,
    defaultVisible: false,
    type: 'currency',
    category: 'prices',
  },

  
  {
    id: 'slDistanceDollar',
    width: 90,
    sortable: false,
    defaultVisible: false,
    type: 'currency',
    category: 'risk',
  },
  {
    id: 'slDistancePercent',
    width: 90,
    sortable: false,
    defaultVisible: false,
    type: 'percentage',
    category: 'risk',
  },
  {
    id: 'riskAmount',
    width: 90,
    sortable: false,
    defaultVisible: false,
    type: 'currency',
    category: 'risk',
  },
  {
    id: 'rMultiple',
    width: 70,
    sortable: true,
    defaultVisible: false,
    type: 'number',
    category: 'risk',
  },
  {
    id: 'maxR',
    width: 80,
    sortable: true,
    defaultVisible: false,
    type: 'number',
    category: 'risk',
  },
  {
    id: 'maePrice',
    width: 100,
    sortable: true,
    defaultVisible: false,
    type: 'currency',
    category: 'risk',
  },
  {
    id: 'mfePrice',
    width: 100,
    sortable: true,
    defaultVisible: false,
    type: 'currency',
    category: 'risk',
  },
  {
    id: 'mae',
    width: 90,
    sortable: true,
    defaultVisible: false,
    type: 'currency',
    category: 'risk',
  },
  {
    id: 'mfe',
    width: 90,
    sortable: true,
    defaultVisible: false,
    type: 'currency',
    category: 'risk',
  },
  {
    id: 'maePercent',
    width: 80,
    sortable: true,
    defaultVisible: false,
    type: 'percentage',
    category: 'risk',
  },
  {
    id: 'mfePercent',
    width: 80,
    sortable: true,
    defaultVisible: false,
    type: 'percentage',
    category: 'risk',
  },

  
  {
    id: 'positionSize',
    width: 90,
    sortable: true,
    defaultVisible: false,
    type: 'number',
    category: 'position',
  },
  {
    id: 'positionValue',
    width: 100,
    sortable: false,
    defaultVisible: false,
    type: 'currency',
    category: 'position',
  },
  {
    id: 'fees',
    width: 80,
    sortable: false,
    defaultVisible: false,
    type: 'currency',
    category: 'position',
  },
  {
    id: 'dividends',
    width: 100,
    sortable: true,
    defaultVisible: false,
    type: 'currency',
    category: 'position',
  },
  {
    id: 'pnl',
    width: 120,
    sortable: true,
    defaultVisible: true,
    type: 'currency',
    category: 'position',
  },
  {
    id: 'returnPercent',
    width: 100,
    sortable: true,
    defaultVisible: false,
    type: 'percentage',
    category: 'position',
  },

  
  {
    id: 'setups',
    width: 100,
    sortable: false,
    defaultVisible: true,
    type: 'text',
    category: 'review',
  },
  {
    id: 'mistakes',
    width: 100,
    sortable: false,
    defaultVisible: true,
    type: 'text',
    category: 'review',
  },
  {
    id: 'tags',
    width: 100,
    sortable: false,
    defaultVisible: true,
    type: 'text',
    category: 'review',
  },
  {
    id: 'reviewed',
    width: 100,
    sortable: false,
    defaultVisible: true,
    type: 'boolean',
    category: 'review',
  },
  {
    id: 'thesis',
    width: 0,
    sortable: false,
    defaultVisible: false,
    type: 'text',
    category: 'review',
  },
  {
    id: 'mtComment',
    width: 0,
    sortable: false,
    defaultVisible: false,
    type: 'text',
    category: 'review',
  }, 
];

function getCustomColumnType(fieldType: CustomFieldType): ColumnType {
  switch (fieldType) {
    case CustomFieldType.NUMBER:
      return 'number';
    case CustomFieldType.DATE:
    case CustomFieldType.DATETIME:
      return 'date';
    case CustomFieldType.TIME:
      return 'time';
    default:
      return 'text';
  }
}

function isCustomColumnSortable(field: CustomFieldDefinition): boolean {
  switch (field.type) {
    case CustomFieldType.TEXT:
    case CustomFieldType.MULTISELECT:
      return false;
    case CustomFieldType.DROPDOWN:
      return Boolean(field.tradeLog?.dropdownSortMode);
    default:
      return true;
  }
}

function getCustomColumnWidth(fieldType: CustomFieldType): number {
  switch (fieldType) {
    case CustomFieldType.NUMBER:
      return 100;
    case CustomFieldType.DATE:
      return 110;
    case CustomFieldType.DATETIME:
      return 140;
    case CustomFieldType.TIME:
      return 95;
    case CustomFieldType.MULTISELECT:
      return 120;
    default:
      return 140;
  }
}

function createCustomTradeLogColumnId(fieldId: string): CustomTradeLogColumnId {
  return `${CUSTOM_TRADE_LOG_COLUMN_PREFIX}${fieldId}`;
}

function createCustomFieldColumnDefinition(
  field: CustomFieldDefinition
): ColumnDefinition {
  return {
    id: createCustomTradeLogColumnId(field.id),
    width: getCustomColumnWidth(field.type),
    sortable: isCustomColumnSortable(field),
    defaultVisible: false,
    type: getCustomColumnType(field.type),
    category: 'custom',
    customField: field,
  };
}

export function buildTradeLogColumnDefinitions(
  customFields: CustomFieldDefinition[] = []
): ColumnDefinition[] {
  return [
    ...COLUMN_DEFINITIONS,
    ...customFields.map((field) => createCustomFieldColumnDefinition(field)),
  ];
}

export function buildDefaultTradeLogSettings(
  customFields: CustomFieldDefinition[] = []
): TradeLogSettings {
  const allColumns = buildTradeLogColumnDefinitions(customFields);
  const defaultTradeLogSettings = DEFAULT_SETTINGS.tradeLog!;
  const defaultOrder = defaultTradeLogSettings.columnOrder;
  const allColumnIds: TradeLogColumnId[] = allColumns.map(
    (column) => column.id
  );

  const columnOrder: TradeLogColumnId[] = [
    ...defaultOrder.filter((id) => allColumnIds.includes(id)),
    ...allColumnIds.filter((id) => !defaultOrder.includes(id)),
  ];

  const columnVisibility: Partial<Record<TradeLogColumnId, boolean>> = {};
  for (const column of allColumns) {
    columnVisibility[column.id] =
      defaultTradeLogSettings.columnVisibility[column.id] ??
      column.defaultVisible;
  }

  return {
    columnVisibility,
    columnOrder,
    columnWidths: { ...defaultTradeLogSettings.columnWidths },
    expandedMode: defaultTradeLogSettings.expandedMode ?? false,
  };
}

export function resolveTradeLogSettings(
  tradeLogSettings: Partial<TradeLogSettings> | undefined,
  customFields: CustomFieldDefinition[] = []
): TradeLogSettings {
  const defaults = buildDefaultTradeLogSettings(customFields);

  return {
    columnVisibility: {
      ...defaults.columnVisibility,
      ...(tradeLogSettings?.columnVisibility || {}),
    },
    columnOrder:
      tradeLogSettings?.columnOrder && tradeLogSettings.columnOrder.length > 0
        ? tradeLogSettings.columnOrder
        : defaults.columnOrder,
    columnWidths: {
      ...defaults.columnWidths,
      ...(tradeLogSettings?.columnWidths || {}),
    },
    expandedMode: tradeLogSettings?.expandedMode ?? defaults.expandedMode,
  };
}


export function getVisibleColumns(
  columnVisibility: Partial<Record<string, boolean>>,
  columnOrder: string[],
  allColumns: ColumnDefinition[] = COLUMN_DEFINITIONS
): ColumnDefinition[] {
  const columnsById: Map<string, ColumnDefinition> = new Map(
    allColumns.map((col) => [col.id, col])
  );

  
  const order =
    columnOrder.length > 0 ? columnOrder : allColumns.map((col) => col.id);

  const ordered = order
    .map((id) => columnsById.get(id))
    .filter((col): col is ColumnDefinition => Boolean(col));

  const remaining = allColumns.filter(
    (col) => !ordered.some((orderedColumn) => orderedColumn.id === col.id)
  );

  return [...ordered, ...remaining].filter((col): col is ColumnDefinition => {
    
    if (Object.keys(columnVisibility).length === 0) {
      return col.defaultVisible;
    }
    
    return columnVisibility[col.id] !== undefined
      ? Boolean(columnVisibility[col.id])
      : col.defaultVisible;
  });
}

export function getColumnLabel(column: ColumnDefinition): string {
  if (column.id === 'select') {
    return '';
  }

  if (column.customField) {
    return column.customField.tradeLog?.columnLabel || column.customField.label;
  }

  const labelKey = `tradelog.column.${column.id}`;
  return hasTranslation(labelKey) ? t(labelKey) : labelKey;
}

export function getColumnCategoryLabel(category: ColumnCategory): string {
  if (category === 'custom') {
    return t('form.section.custom-fields');
  }

  const labelKey = `tradelog.category.${category}`;
  return hasTranslation(labelKey) ? t(labelKey) : labelKey;
}


export function generateGridTemplate(
  columns: ColumnDefinition[],
  viewLevel?: string,
  isExpandedMode?: boolean,
  measuredWidths?: Record<string, number>
): string {
  
  const expandableColumns = ['setups', 'mistakes', 'tags'];

  const columnTemplate = columns
    .map((col) => {
      if (col.width === 0) {
        return 'minmax(320px, 2fr)'; 
      }
      if (col.id === 'select') {
        return '40px'; 
      }
      if (col.id === 'image') {
        return '50px'; 
      }
      
      if (
        isExpandedMode &&
        (expandableColumns.includes(col.id) ||
          col.customField?.type === CustomFieldType.MULTISELECT)
      ) {
        const measuredWidth = measuredWidths?.[col.id];
        if (measuredWidth && measuredWidth > 0) {
          
          return `${Math.ceil(measuredWidth) + 8}px`;
        }
        
        return `minmax(${col.width}px, max-content)`;
      }
      
      return `minmax(${col.width}px, 1fr)`;
    })
    .join(' ');

  
  if (viewLevel && viewLevel !== 'trades') {
    return `20px ${columnTemplate}`;
  }

  return columnTemplate;
}


export function getSortIconName(
  columnType: ColumnType,
  sortDirection: 'asc' | 'desc' | null
): string {
  
  if (!sortDirection) {
    return 'ArrowUpDown';
  }

  
  switch (columnType) {
    case 'currency':
    case 'number':
    case 'percentage':
    case 'date':
    case 'time':
      return sortDirection === 'asc' ? 'ArrowUp01' : 'ArrowDown10';

    case 'duration':
      return sortDirection === 'asc'
        ? 'ArrowUpNarrowWide'
        : 'ArrowDownWideNarrow';

    case 'text':
    case 'boolean':
    default:
      return sortDirection === 'asc' ? 'ArrowUpAZ' : 'ArrowDownZA';
  }
}
