

import { t } from '../../../lang/helpers';
import {
  TradeFormLayoutItemId,
  TradeFormLayoutSettings,
  resolveTradeFormLayoutSettings,
} from '../../../settings/types';
import type { TradeFormData } from './types';
import type { CustomFieldValues } from '../../../types/customFields';
import type { VisibilityEditorCategory } from '../../shared/visibilityEditor';

type TradeFormLayoutCategoryId = 'basic' | 'details' | 'advanced';

interface TradeFormLayoutItemDefinition {
  id: TradeFormLayoutItemId;
  category: TradeFormLayoutCategoryId;
  label: string;
  description?: string;
}

export const TRADE_FORM_DETAILS_ITEM_IDS: TradeFormLayoutItemId[] = [
  'setup',
  'mistake',
  'customTags',
  'thesis',
  'attachments',
];

export const TRADE_FORM_BASIC_OPTIONAL_ITEM_IDS: TradeFormLayoutItemId[] = [
  'tradingCosts',
  'tradingCostRebate',
  'tradingCostSwap',
  'tradingCostFees',
  'riskPlanning',
  'takeProfits',
  'idealExits',
  'maeMfe',
  'pnlPreview',
  'importShortcut',
  'realizedPnlPreview',
];

export function getTradeFormLayoutCategories(): VisibilityEditorCategory[] {
  return [
    { id: 'basic', label: t('form.tab.basic') },
    { id: 'details', label: t('form.tab.details') },
    { id: 'advanced', label: t('form.tab.advanced') },
  ];
}

export function getTradeFormLayoutItemDefinitions(): TradeFormLayoutItemDefinition[] {
  return [
    {
      id: 'assetSpecific',
      category: 'basic',
      label: t('form.layout.item.asset-specific'),
    },
    {
      id: 'tradingCosts',
      category: 'basic',
      label: t('form.layout.item.trading-costs.commission'),
    },
    {
      id: 'tradingCostRebate',
      category: 'basic',
      label: t('form.field.rebate'),
    },
    {
      id: 'tradingCostSwap',
      category: 'basic',
      label: t('form.field.swap'),
    },
    {
      id: 'tradingCostFees',
      category: 'basic',
      label: t('form.field.other-fees'),
    },
    {
      id: 'riskPlanning',
      category: 'basic',
      label: `${t('form.field.stop-loss')} / ${t('form.field.risk-amount')}`,
    },
    {
      id: 'takeProfits',
      category: 'basic',
      label: t('form.section.take-profits'),
    },
    {
      id: 'idealExits',
      category: 'basic',
      label: t('form.ideal-exit.title'),
    },
    {
      id: 'maeMfe',
      category: 'basic',
      label: 'MAE / MFE',
    },
    {
      id: 'pnlPreview',
      category: 'basic',
      label: t('form.layout.item.pnl-preview'),
    },
    {
      id: 'importShortcut',
      category: 'basic',
      label: t('form.layout.item.import-shortcut'),
      description: t('form.layout.item.import-shortcut-desc'),
    },
    {
      id: 'realizedPnlPreview',
      category: 'basic',
      label: t('form.layout.item.realized-pnl-preview'),
      description: t('form.layout.item.realized-pnl-preview-desc'),
    },
    {
      id: 'setup',
      category: 'details',
      label: t('form.field.setup'),
    },
    {
      id: 'mistake',
      category: 'details',
      label: t('form.field.mistake'),
    },
    {
      id: 'customTags',
      category: 'details',
      label: t('form.field.custom-tags'),
    },
    {
      id: 'thesis',
      category: 'details',
      label: t('form.field.trade-thesis'),
    },
    {
      id: 'attachments',
      category: 'details',
      label: t('form.section.attachments'),
    },
    {
      id: 'customFields',
      category: 'advanced',
      label: t('form.section.custom-fields'),
    },
  ];
}

export function getResolvedTradeFormLayout(
  settings: Partial<TradeFormLayoutSettings> | null | undefined
): TradeFormLayoutSettings {
  return resolveTradeFormLayoutSettings(settings);
}

export function isTradeFormLayoutItemVisible(
  layout: TradeFormLayoutSettings,
  itemId: TradeFormLayoutItemId
): boolean {
  return layout.visibleItems.includes(itemId);
}

function getVisibleOrderedTradeFormLayoutItems(
  layout: TradeFormLayoutSettings,
  itemIds?: readonly TradeFormLayoutItemId[]
): TradeFormLayoutItemId[] {
  const allowedItems = itemIds ? new Set<TradeFormLayoutItemId>(itemIds) : null;
  const visibleItems = new Set(layout.visibleItems);

  return layout.itemOrder.filter(
    (itemId) =>
      visibleItems.has(itemId) && (!allowedItems || allowedItems.has(itemId))
  );
}

const hasNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const hasArrayEntries = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value.length > 0;

const hasNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const hasNonZeroNumber = (value: unknown): value is number =>
  hasNumber(value) && value !== 0;

const hasMeaningfulCustomFieldValue = (value: unknown): boolean => {
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;

  return true;
};

export function hasPopulatedTradeFormLayoutItem(
  data: Partial<TradeFormData>,
  itemId: TradeFormLayoutItemId,
  customFieldValues?: CustomFieldValues
): boolean {
  switch (itemId) {
    case 'assetSpecific':
      return Boolean(
        hasNonEmptyString(data.exchange) ||
        data.expirationDate ||
        hasNumber(data.strikePrice) ||
        hasNonEmptyString(data.optionType) ||
        hasNumber(data.contractSize) ||
        hasNonEmptyString(data.contractSymbol) ||
        hasNumber(data.dollarPerPoint) ||
        hasNumber(data.tickSize) ||
        hasNumber(data.tickValue) ||
        hasNonEmptyString(data.currencyPair) ||
        hasNumber(data.lotSize) ||
        hasNumber(data.pipValue) ||
        hasNonEmptyString(data.tradingPair) ||
        hasNonEmptyString(data.cryptoExchange) ||
        hasNumber(data.leverageRatio)
      );
    case 'tradingCosts':
      return (
        hasNonZeroNumber(data.commission) || data.hasExplicitCommission === true
      );
    case 'tradingCostRebate':
      return hasNonZeroNumber(data.rebate);
    case 'tradingCostSwap':
      return hasNonZeroNumber(data.swap);
    case 'tradingCostFees':
      return hasNonZeroNumber(data.fees);
    case 'riskPlanning':
      return hasNumber(data.stopLoss) || hasNumber(data.riskAmount);
    case 'takeProfits':
      return hasArrayEntries(data.takeProfits);
    case 'idealExits':
      return hasArrayEntries(data.idealExits);
    case 'maeMfe':
      return Boolean(
        hasNumber(data.mae) ||
        hasNumber(data.mfe) ||
        hasNumber(data.maePrice) ||
        hasNumber(data.mfePrice)
      );
    case 'setup':
      return hasArrayEntries(data.setup);
    case 'mistake':
      return hasArrayEntries(data.mistake);
    case 'customTags':
      return hasArrayEntries(data.customTags) || hasArrayEntries(data.tags);
    case 'thesis':
      return hasNonEmptyString(data.thesis);
    case 'attachments':
      return hasArrayEntries(data.images);
    case 'customFields':
      return Object.values(customFieldValues ?? data.customFields ?? {}).some(
        hasMeaningfulCustomFieldValue
      );
    default:
      return false;
  }
}

export function getEditAwareVisibleOrderedTradeFormLayoutItems(
  layout: TradeFormLayoutSettings,
  itemIds: readonly TradeFormLayoutItemId[],
  data: Partial<TradeFormData>,
  isEditMode: boolean,
  customFieldValues?: CustomFieldValues
): TradeFormLayoutItemId[] {
  const visibleItems = getVisibleOrderedTradeFormLayoutItems(layout, itemIds);
  if (!isEditMode) return visibleItems;

  const visibleItemSet = new Set(visibleItems);
  for (const itemId of itemIds) {
    if (
      !visibleItemSet.has(itemId) &&
      hasPopulatedTradeFormLayoutItem(data, itemId, customFieldValues)
    ) {
      visibleItems.push(itemId);
      visibleItemSet.add(itemId);
    }
  }

  return visibleItems;
}
