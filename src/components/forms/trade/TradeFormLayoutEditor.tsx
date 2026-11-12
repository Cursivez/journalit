

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import JournalitPlugin from '../../../main';
import { SegmentedControl } from '../../shared/SegmentedControl';
import {
  VisibilityEditor,
  VisibilityEditorItem,
  VisibilityEditorTab,
} from '../../shared/visibilityEditor';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';
import { useTradeFormLayoutSave } from './hooks/useTradeFormLayoutSave';
import {
  DEFAULT_SETTINGS,
  DEFAULT_TRADE_FORM_LAYOUT_SETTINGS,
  TradeFormAssetTypeMode,
  TradeFormDefaultAssetType,
  TradeFormInputMode,
  TradeFormLayoutItemId,
  TradeFormLayoutSettings,
  TradeFormStopLossUnit,
  TradeFormTakeProfitUnit,
  resolveTradeFormLayoutSettings,
} from '../../../settings/types';
import {
  getTradeFormLayoutCategories,
  getTradeFormLayoutItemDefinitions,
} from './tradeFormLayoutConfig';
import {
  readTradeFormEntryPreferences,
  type TradeFormEntryPreferences,
} from './tradeFormEntryPreferences';
import {
  AssetTypeModeCard,
  EntryPreferenceCards,
  InputModeCard,
  MaeMfeEntryControl,
} from './TradeFormLayoutModeCards';






const PNL_RISK_UNAVAILABLE_LAYOUT_ITEMS = new Set<string>([
  'idealExits',
  'directPnlToggle',
]);

const NON_REORDERABLE_LAYOUT_ITEMS = new Set<string>([
  
  'importShortcut',
  
  'assetSpecific',
  
  'exchange',
  
  'directPnlToggle',
  
  'idealExits',
  
  'unrealizedSnapshot',
  
  'dividends',
  
  'pnlPreview',
  
  'customFields',
  
  'tradeCurrency',
]);

const COST_LAYOUT_ITEMS = new Set<string>([
  'tradingCosts',
  'tradingCostRebate',
  'tradingCostSwap',
  'tradingCostFees',
]);
const COST_LAYOUT_ITEM_ORDER: TradeFormLayoutItemId[] = [
  'tradingCosts',
  'tradingCostRebate',
  'tradingCostSwap',
  'tradingCostFees',
];
const TRADING_COSTS_EDITOR_ID = '__tradingCosts';

const RISK_LAYOUT_ITEMS = new Set<string>([
  'riskPlanning',
  'takeProfits',
  'maeMfe',
]);
const RISK_LAYOUT_ITEM_ORDER: TradeFormLayoutItemId[] = [
  'riskPlanning',
  'takeProfits',
  'maeMfe',
];
const RISK_MANAGEMENT_EDITOR_ID = '__riskManagement';
const EXECUTION_EMBEDDED_LAYOUT_ITEMS = new Set<string>([
  'idealExits',
  'unrealizedSnapshot',
  'dividends',
]);


const EXECUTION_EMBEDDED_LAYOUT_ITEM_ORDER = [
  'unrealizedSnapshot',
  'idealExits',
  'dividends',
];





const FIXED_TOP_LAYOUT_ITEMS = new Set<string>([
  'assetSpecific',
  'exchange',
  'directPnlToggle',
  'tradeCurrency',
]);
const FIXED_BOTTOM_LAYOUT_ITEMS = new Set<string>([
  'pnlPreview',
  'importShortcut',
]);
const FIXED_BOTTOM_LAYOUT_ITEM_ORDER = ['pnlPreview', 'importShortcut'];
const createCoreFormDetailsItem = (): VisibilityEditorItem => ({
  id: '__coreTradeDetails',
  label: t('form.layout.item.core-details'),
  category: 'basic',
  description: t('form.layout.item.core-details-desc'),
  locked: true,
  reorderable: false,
});

const createRiskManagementItem = (
  description?: React.ReactNode
): VisibilityEditorItem => ({
  id: RISK_MANAGEMENT_EDITOR_ID,
  label: t('form.section.risk-management'),
  category: 'basic',
  description,
});

const createTradingCostsItem = (
  description?: React.ReactNode
): VisibilityEditorItem => ({
  id: TRADING_COSTS_EDITOR_ID,
  label: t('form.section.trading-costs'),
  category: 'basic',
  description,
});

interface TradeFormLayoutEditorProps {
  plugin: JournalitPlugin;
  onSave?: (layout: TradeFormLayoutSettings) => void;
  onCancel?: () => void;
  compactFooter?: boolean;
  dirtyStateRef?: { current: (() => boolean) | null };
  savingStateRef?: { current: boolean };
  saveLabel?: string;
}

const createEditorItems = (
  layout: TradeFormLayoutSettings,
  costDescription?: React.ReactNode,
  riskDescription?: React.ReactNode,
  tradeCurrencyDescription?: React.ReactNode
): {
  activeItems: VisibilityEditorItem[];
  availableItems: VisibilityEditorItem[];
} => {
  const definitions = getTradeFormLayoutItemDefinitions().filter(
    (definition) =>
      layout.inputMode !== 'pnl-risk' ||
      !PNL_RISK_UNAVAILABLE_LAYOUT_ITEMS.has(definition.id)
  );
  const definitionById = new Map(definitions.map((item) => [item.id, item]));
  const visibleSet = new Set<string>(layout.visibleItems);

  const orderedItems = layout.itemOrder.flatMap<VisibilityEditorItem>(
    (itemId) => {
      const definition = definitionById.get(itemId);
      return definition
        ? [
            {
              id: definition.id,
              label: definition.label,
              category: definition.category,
              description: definition.description,
              reorderable: !NON_REORDERABLE_LAYOUT_ITEMS.has(definition.id),
            },
          ]
        : [];
    }
  );

  const activeOrderedItems = orderedItems.flatMap<VisibilityEditorItem>(
    (item) => {
      if (!visibleSet.has(item.id)) return [];
      return [
        item.id === 'tradeCurrency' && tradeCurrencyDescription
          ? { ...item, description: tradeCurrencyDescription }
          : item,
      ];
    }
  );
  const fixedTopItems = activeOrderedItems.filter((item) =>
    FIXED_TOP_LAYOUT_ITEMS.has(item.id)
  );
  const fixedBottomItems = activeOrderedItems
    .filter((item) => FIXED_BOTTOM_LAYOUT_ITEMS.has(item.id))
    .sort(
      (left, right) =>
        FIXED_BOTTOM_LAYOUT_ITEM_ORDER.indexOf(left.id) -
        FIXED_BOTTOM_LAYOUT_ITEM_ORDER.indexOf(right.id)
    );
  const movableItems = activeOrderedItems.filter(
    (item) =>
      !FIXED_TOP_LAYOUT_ITEMS.has(item.id) &&
      !FIXED_BOTTOM_LAYOUT_ITEMS.has(item.id) &&
      !COST_LAYOUT_ITEMS.has(item.id) &&
      !RISK_LAYOUT_ITEMS.has(item.id) &&
      !EXECUTION_EMBEDDED_LAYOUT_ITEMS.has(item.id)
  );
  const visibleExecutionEmbeddedItems = activeOrderedItems
    .filter((item) => EXECUTION_EMBEDDED_LAYOUT_ITEMS.has(item.id))
    .sort(
      (left, right) =>
        EXECUTION_EMBEDDED_LAYOUT_ITEM_ORDER.indexOf(left.id) -
        EXECUTION_EMBEDDED_LAYOUT_ITEM_ORDER.indexOf(right.id)
    );
  const visibleCostItems = activeOrderedItems.filter((item) =>
    COST_LAYOUT_ITEMS.has(item.id)
  );
  const firstVisibleCostIndex = activeOrderedItems.findIndex((item) =>
    COST_LAYOUT_ITEMS.has(item.id)
  );
  if (firstVisibleCostIndex !== -1 && visibleCostItems.length > 0) {
    const movableInsertIndex = activeOrderedItems
      .slice(0, firstVisibleCostIndex)
      .filter(
        (item) =>
          !FIXED_TOP_LAYOUT_ITEMS.has(item.id) &&
          !FIXED_BOTTOM_LAYOUT_ITEMS.has(item.id) &&
          !COST_LAYOUT_ITEMS.has(item.id) &&
          !RISK_LAYOUT_ITEMS.has(item.id) &&
          !EXECUTION_EMBEDDED_LAYOUT_ITEMS.has(item.id)
      ).length;
    movableItems.splice(
      movableInsertIndex,
      0,
      createTradingCostsItem(costDescription)
    );
  }
  const visibleRiskItems = activeOrderedItems.filter((item) =>
    RISK_LAYOUT_ITEMS.has(item.id)
  );
  const firstVisibleRiskIndex = activeOrderedItems.findIndex((item) =>
    RISK_LAYOUT_ITEMS.has(item.id)
  );
  if (firstVisibleRiskIndex !== -1 && visibleRiskItems.length > 0) {
    const movableInsertIndex = activeOrderedItems
      .slice(0, firstVisibleRiskIndex)
      .filter(
        (item) =>
          !FIXED_TOP_LAYOUT_ITEMS.has(item.id) &&
          !FIXED_BOTTOM_LAYOUT_ITEMS.has(item.id) &&
          !COST_LAYOUT_ITEMS.has(item.id) &&
          !RISK_LAYOUT_ITEMS.has(item.id) &&
          !EXECUTION_EMBEDDED_LAYOUT_ITEMS.has(item.id)
      ).length;
    movableItems.splice(
      movableInsertIndex,
      0,
      ...visibleExecutionEmbeddedItems,
      createRiskManagementItem(riskDescription)
    );
  } else if (visibleExecutionEmbeddedItems.length > 0) {
    movableItems.push(...visibleExecutionEmbeddedItems);
  }

  return {
    activeItems: [
      createCoreFormDetailsItem(),
      ...fixedTopItems,
      ...movableItems,
      ...fixedBottomItems,
    ],
    availableItems: [
      ...orderedItems.filter(
        (item) =>
          !visibleSet.has(item.id) &&
          !COST_LAYOUT_ITEMS.has(item.id) &&
          !RISK_LAYOUT_ITEMS.has(item.id)
      ),
      ...(visibleCostItems.length === 0 ? [createTradingCostsItem()] : []),
      ...(visibleRiskItems.length === 0 ? [createRiskManagementItem()] : []),
    ],
  };
};

const parseDefaultAssetType = (
  value: string
): TradeFormDefaultAssetType | null => {
  switch (value) {
    case 'stock':
    case 'options':
    case 'futures':
    case 'forex':
    case 'crypto':
    case 'cfd':
      return value;
    default:
      return null;
  }
};

interface RiskFieldsVisibilitySelectorProps {
  layout: TradeFormLayoutSettings;
  onChange: (itemId: string, isVisible: boolean) => void;
  onTakeProfitUnitChange: (unit: TradeFormTakeProfitUnit) => void;
  onStopLossUnitChange: (unit: TradeFormStopLossUnit) => void;
  
  maeMfeControl: React.ReactNode;
}

interface CostFieldsVisibilitySelectorProps {
  layout: TradeFormLayoutSettings;
  onChange: (itemId: string, isVisible: boolean) => void;
}

const CostFieldsVisibilitySelector: React.FC<
  CostFieldsVisibilitySelectorProps
> = ({ layout, onChange }) => {
  const costItems = getTradeFormLayoutItemDefinitions().reduce<
    ReturnType<typeof getTradeFormLayoutItemDefinitions>
  >((items, item) => {
    if (COST_LAYOUT_ITEMS.has(item.id)) items.push(item);
    return items;
  }, []);

  const visibleItemsSet = new Set(layout.visibleItems);
  return (
    <div className="journalit-trade-form-layout-editor__risk-fields">
      {costItems.map((item) => (
        <label
          key={item.id}
          className="journalit-trade-form-layout-editor__risk-field"
        >
          <input
            type="checkbox"
            checked={visibleItemsSet.has(item.id)}
            onChange={(event) => onChange(item.id, event.currentTarget.checked)}
          />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
};

CostFieldsVisibilitySelector.displayName = 'CostFieldsVisibilitySelector';

const RiskFieldsVisibilitySelector: React.FC<
  RiskFieldsVisibilitySelectorProps
> = ({
  layout,
  onChange,
  onTakeProfitUnitChange,
  onStopLossUnitChange,
  maeMfeControl,
}) => {
  const riskItems = getTradeFormLayoutItemDefinitions().reduce<
    ReturnType<typeof getTradeFormLayoutItemDefinitions>
  >((items, item) => {
    if (RISK_LAYOUT_ITEMS.has(item.id)) items.push(item);
    return items;
  }, []);

  const visibleItemsSet2 = new Set(layout.visibleItems);
  return (
    <div className="journalit-trade-form-layout-editor__risk-fields">
      {riskItems.map((item) => (
        <React.Fragment key={item.id}>
          <label className="journalit-trade-form-layout-editor__risk-field">
            <input
              type="checkbox"
              checked={visibleItemsSet2.has(item.id)}
              onChange={(event) =>
                onChange(item.id, event.currentTarget.checked)
              }
            />
            <span>{item.label}</span>
          </label>
          {item.id === 'riskPlanning' &&
            visibleItemsSet2.has('riskPlanning') && (
              <div className="journalit-trade-form-layout-editor__target-unit">
                <span className="journalit-trade-form-layout-editor__target-unit-label">
                  {t('form.layout.stop-loss-unit')}
                </span>
                <SegmentedControl<TradeFormStopLossUnit>
                  options={[
                    {
                      value: 'percent',
                      label: t('form.layout.stop-loss-unit-percent'),
                    },
                    {
                      value: 'size',
                      label: t('form.layout.stop-loss-unit-size'),
                    },
                  ]}
                  value={layout.stopLossUnit}
                  onChange={onStopLossUnitChange}
                  size="small"
                  fullWidth={false}
                />
              </div>
            )}
          {item.id === 'takeProfits' && visibleItemsSet2.has('takeProfits') && (
            <div className="journalit-trade-form-layout-editor__target-unit">
              <span className="journalit-trade-form-layout-editor__target-unit-label">
                {t('form.layout.take-profit-unit')}
              </span>
              <SegmentedControl<TradeFormTakeProfitUnit>
                options={[
                  {
                    value: 'percent',
                    label: t('form.layout.take-profit-unit-percent'),
                  },
                  {
                    value: 'size',
                    label: t('form.layout.take-profit-unit-size'),
                  },
                ]}
                value={layout.takeProfitUnit}
                onChange={onTakeProfitUnitChange}
                size="small"
                fullWidth={false}
              />
            </div>
          )}
          {item.id === 'maeMfe' &&
            visibleItemsSet2.has('maeMfe') &&
            maeMfeControl}
        </React.Fragment>
      ))}
    </div>
  );
};

RiskFieldsVisibilitySelector.displayName = 'RiskFieldsVisibilitySelector';

interface ManualFxRateToggleProps {
  layout: TradeFormLayoutSettings;
  onChange: (showManualFxRate: boolean) => void;
}

const ManualFxRateToggle: React.FC<ManualFxRateToggleProps> = ({
  layout,
  onChange,
}) => (
  <div className="journalit-trade-form-layout-editor__risk-fields">
    <label className="journalit-trade-form-layout-editor__risk-field">
      <input
        type="checkbox"
        checked={layout.showManualFxRate}
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <span>{t('form.layout.manual-fx-rate')}</span>
    </label>
  </div>
);

ManualFxRateToggle.displayName = 'ManualFxRateToggle';

interface LayoutEditorFooterProps {
  compactFooter: boolean;
  isSaving: boolean;
  onReset: () => void;
  onCancel?: () => void;
  onSave: () => void;
  saveLabel: string;
}

const LayoutEditorFooter: React.FC<LayoutEditorFooterProps> = ({
  compactFooter,
  isSaving,
  onReset,
  onCancel,
  onSave,
  saveLabel,
}) => (
  <div
    className={`journalit-trade-form-layout-editor__footer ${compactFooter ? 'is-compact' : ''}`}
  >
    <Button
      type="button"
      variant="plain"
      className="journalit-trade-form-layout-editor__reset"
      onClick={onReset}
      disabled={isSaving}
    >
      {t('tradelog.settings.reset')}
    </Button>
    {onCancel && (
      <Button
        type="button"
        variant="plain"
        className="cancel-button"
        data-journalit-guide-target="trade-form.layout-cancel"
        onClick={onCancel}
        disabled={isSaving}
      >
        {t('button.cancel')}
      </Button>
    )}
    <Button
      type="button"
      variant="primary"
      className="create-account-button accent-button modal-save-accent"
      onClick={onSave}
      disabled={isSaving}
    >
      {isSaving ? t('tradelog.settings.saving') : saveLabel}
    </Button>
  </div>
);

LayoutEditorFooter.displayName = 'LayoutEditorFooter';

const reorderTradeFormLayoutItems = (
  previous: TradeFormLayoutSettings,
  activeId: string,
  overId: string
): TradeFormLayoutSettings => {
  const visibleSet = new Set<string>(previous.visibleItems);
  const activeOrder: string[] = [];
  let costsInserted = false;
  let riskInserted = false;

  for (const itemId of previous.itemOrder) {
    if (!visibleSet.has(itemId) || NON_REORDERABLE_LAYOUT_ITEMS.has(itemId)) {
      continue;
    }
    if (COST_LAYOUT_ITEMS.has(itemId)) {
      if (!costsInserted) {
        activeOrder.push(TRADING_COSTS_EDITOR_ID);
        costsInserted = true;
      }
      continue;
    }
    if (RISK_LAYOUT_ITEMS.has(itemId)) {
      if (!riskInserted) {
        activeOrder.push(RISK_MANAGEMENT_EDITOR_ID);
        riskInserted = true;
      }
      continue;
    }
    activeOrder.push(itemId);
  }

  const oldIndex = activeOrder.indexOf(activeId);
  const newIndex = activeOrder.indexOf(overId);
  if (oldIndex === -1 || newIndex === -1) return previous;

  const nextActiveOrder = [...activeOrder];
  const [movedItem] = nextActiveOrder.splice(oldIndex, 1);
  nextActiveOrder.splice(newIndex, 0, movedItem);

  const expandedActiveOrder = nextActiveOrder.reduce<TradeFormLayoutItemId[]>(
    (items, itemId) => {
      if (itemId === TRADING_COSTS_EDITOR_ID) {
        for (const costItemId of COST_LAYOUT_ITEM_ORDER) {
          if (visibleSet.has(costItemId)) items.push(costItemId);
        }
        return items;
      }
      if (itemId === RISK_MANAGEMENT_EDITOR_ID) {
        for (const riskItemId of RISK_LAYOUT_ITEM_ORDER) {
          if (visibleSet.has(riskItemId)) items.push(riskItemId);
        }
        return items;
      }
      const layoutItemId = previous.itemOrder.find(
        (currentId) => currentId === itemId
      );
      if (layoutItemId) items.push(layoutItemId);
      return items;
    },
    []
  );
  const activeOrderSet = new Set(expandedActiveOrder);
  const hiddenOrder = previous.itemOrder.filter(
    (itemId) => !activeOrderSet.has(itemId)
  );

  return {
    ...previous,
    itemOrder: [...expandedActiveOrder, ...hiddenOrder],
  };
};

export const TradeFormLayoutEditor: React.FC<TradeFormLayoutEditorProps> = ({
  plugin,
  onSave,
  onCancel,
  compactFooter = false,
  dirtyStateRef,
  savingStateRef,
  saveLabel = t('button.save'),
}) => {
  const initialLayout = useMemo(
    () => resolveTradeFormLayoutSettings(plugin.settings.trade.tradeFormLayout),
    [plugin]
  );
  const [layout, setLayout] = useState<TradeFormLayoutSettings>(initialLayout);
  const initialEntry = useMemo(
    () => readTradeFormEntryPreferences(plugin.settings.trade),
    [plugin]
  );
  const [entry, setEntry] = useState<TradeFormEntryPreferences>(initialEntry);
  const updateEntry = (change: Partial<TradeFormEntryPreferences>) =>
    setEntry((previous) => ({ ...previous, ...change }));
  const [activeTab, setActiveTab] = useState<VisibilityEditorTab>('active');
  const { isSaving, saveLayout } = useTradeFormLayoutSave({
    plugin,
    applySavedLayout: setLayout,
    onSave,
    savingStateRef,
  });
  const isDirty = useCallback(
    (): boolean =>
      JSON.stringify(resolveTradeFormLayoutSettings(layout)) !==
        JSON.stringify(resolveTradeFormLayoutSettings(initialLayout)) ||
      JSON.stringify(entry) !== JSON.stringify(initialEntry),
    [initialLayout, layout, initialEntry, entry]
  );

  useEffect(() => {
    if (!dirtyStateRef) return;

    dirtyStateRef.current = isDirty;
    return () => {
      if (dirtyStateRef.current === isDirty) {
        dirtyStateRef.current = null;
      }
    };
  }, [dirtyStateRef, isDirty]);

  const handleInputModeChange = (inputMode: TradeFormInputMode) => {
    setLayout((previous) => ({
      ...previous,
      inputMode,
      visibleItems:
        inputMode === 'pnl-risk'
          ? previous.visibleItems.filter((itemId) => itemId !== 'idealExits')
          : previous.visibleItems,
    }));
  };

  const handleAssetTypeModeChange = (assetTypeMode: TradeFormAssetTypeMode) => {
    setLayout((previous) => ({ ...previous, assetTypeMode }));
  };

  const handleDefaultAssetTypeChange = (defaultAssetType: string) => {
    const parsedAssetType = parseDefaultAssetType(defaultAssetType);
    if (!parsedAssetType) return;

    setLayout((previous) => ({
      ...previous,
      defaultAssetType: parsedAssetType,
    }));
  };

  const handleRiskGroupVisibilityChange = (
    itemId: string,
    isVisible: boolean
  ) => {
    setLayout((previous) => {
      const riskItemId = RISK_LAYOUT_ITEM_ORDER.find(
        (currentId) => currentId === itemId
      );
      if (!riskItemId) return previous;

      return {
        ...previous,
        visibleItems: isVisible
          ? [...previous.visibleItems, riskItemId]
          : previous.visibleItems.filter(
              (currentId) => currentId !== riskItemId
            ),
      };
    });
  };

  const handleCostGroupVisibilityChange = (
    itemId: string,
    isVisible: boolean
  ) => {
    setLayout((previous) => {
      const costItemId = COST_LAYOUT_ITEM_ORDER.find(
        (currentId) => currentId === itemId
      );
      if (!costItemId) return previous;

      return {
        ...previous,
        visibleItems: isVisible
          ? [...previous.visibleItems, costItemId]
          : previous.visibleItems.filter(
              (currentId) => currentId !== costItemId
            ),
      };
    });
  };

  const handleManualFxRateChange = (showManualFxRate: boolean) => {
    setLayout((previous) => ({ ...previous, showManualFxRate }));
  };

  const handleTakeProfitUnitChange = (
    takeProfitUnit: TradeFormTakeProfitUnit
  ) => {
    setLayout((previous) => ({ ...previous, takeProfitUnit }));
  };

  const handleStopLossUnitChange = (stopLossUnit: TradeFormStopLossUnit) => {
    setLayout((previous) => ({ ...previous, stopLossUnit }));
  };

  const { activeItems, availableItems } = useMemo(
    () =>
      createEditorItems(
        layout,
        <CostFieldsVisibilitySelector
          layout={layout}
          onChange={handleCostGroupVisibilityChange}
        />,
        <RiskFieldsVisibilitySelector
          layout={layout}
          onChange={handleRiskGroupVisibilityChange}
          onTakeProfitUnitChange={handleTakeProfitUnitChange}
          onStopLossUnitChange={handleStopLossUnitChange}
          maeMfeControl={
            <MaeMfeEntryControl
              value={entry.maeMfeInputMode}
              onChange={(maeMfeInputMode) => updateEntry({ maeMfeInputMode })}
            />
          }
        />,
        <ManualFxRateToggle
          layout={layout}
          onChange={handleManualFxRateChange}
        />
      ),
    [layout, entry.maeMfeInputMode]
  );

  const handleReorder = (activeId: string, overId: string) => {
    if (NON_REORDERABLE_LAYOUT_ITEMS.has(activeId)) return;

    setLayout((previous) =>
      reorderTradeFormLayoutItems(previous, activeId, overId)
    );
  };

  const handleAdd = (itemId: string) => {
    setLayout((previous) => {
      if (itemId === TRADING_COSTS_EDITOR_ID) {
        const costItemsToAdd = COST_LAYOUT_ITEM_ORDER.filter(
          (costItemId) => !previous.visibleItems.includes(costItemId)
        );
        return {
          ...previous,
          visibleItems: [...previous.visibleItems, ...costItemsToAdd],
        };
      }

      if (itemId === RISK_MANAGEMENT_EDITOR_ID) {
        const riskItemsToAdd = RISK_LAYOUT_ITEM_ORDER.filter(
          (riskItemId) => !previous.visibleItems.includes(riskItemId)
        );
        return {
          ...previous,
          visibleItems: [...previous.visibleItems, ...riskItemsToAdd],
        };
      }

      const itemToAdd = previous.itemOrder.find(
        (currentId) => currentId === itemId
      );
      if (previous.inputMode === 'pnl-risk' && itemToAdd === 'idealExits') {
        return previous;
      }
      if (!itemToAdd || previous.visibleItems.includes(itemToAdd)) {
        return previous;
      }

      return {
        ...previous,
        visibleItems: [...previous.visibleItems, itemToAdd],
        itemOrder: [
          ...previous.itemOrder.filter((currentId) => currentId !== itemToAdd),
          itemToAdd,
        ],
      };
    });
  };

  const handleRemove = (itemId: string) => {
    if (itemId === TRADING_COSTS_EDITOR_ID) {
      setLayout((previous) => ({
        ...previous,
        visibleItems: previous.visibleItems.filter(
          (currentId) => !COST_LAYOUT_ITEMS.has(currentId)
        ),
      }));
      return;
    }

    if (itemId === RISK_MANAGEMENT_EDITOR_ID) {
      setLayout((previous) => ({
        ...previous,
        visibleItems: previous.visibleItems.filter(
          (currentId) => !RISK_LAYOUT_ITEMS.has(currentId)
        ),
      }));
      return;
    }

    setLayout((previous) => ({
      ...previous,
      visibleItems: previous.visibleItems.filter(
        (currentId) => currentId !== itemId
      ),
    }));
  };

  const handleReset = () => {
    setLayout(
      resolveTradeFormLayoutSettings(DEFAULT_TRADE_FORM_LAYOUT_SETTINGS)
    );
    setEntry(readTradeFormEntryPreferences(DEFAULT_SETTINGS.trade));
  };

  return (
    <div className="journalit-trade-form-layout-editor">
      <div className="journalit-trade-form-layout-editor__mode-stack">
        <InputModeCard
          value={layout.inputMode}
          onChange={handleInputModeChange}
        />

        <AssetTypeModeCard
          assetTypeMode={layout.assetTypeMode}
          defaultAssetType={layout.defaultAssetType}
          onAssetTypeModeChange={handleAssetTypeModeChange}
          onDefaultAssetTypeChange={handleDefaultAssetTypeChange}
        />

        <EntryPreferenceCards entry={entry} onChange={updateEntry} />
      </div>

      <VisibilityEditor
        activeItems={activeItems}
        availableItems={availableItems}
        categories={getTradeFormLayoutCategories()}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        activeTabLabel={t('form.layout.active-fields')}
        availableTabLabel={t('form.layout.available-fields')}
        activeDescription={t('form.layout.active-fields-desc')}
        availableDescription={t('form.layout.available-fields-desc')}
        emptyActiveText={t('form.layout.empty-active')}
        emptyAvailableText={t('form.layout.all-active')}
        getAddAriaLabel={(label) =>
          t('form.layout.add-field-aria', { field: label })
        }
        getRemoveAriaLabel={(label) =>
          t('form.layout.remove-field-aria', { field: label })
        }
        onReorder={handleReorder}
        onAdd={handleAdd}
        onRemove={handleRemove}
        groupActiveByCategory={true}
      />

      <LayoutEditorFooter
        compactFooter={compactFooter}
        saveLabel={saveLabel}
        isSaving={isSaving}
        onReset={handleReset}
        onCancel={onCancel}
        onSave={() => void saveLayout(layout, entry)}
      />
    </div>
  );
};

TradeFormLayoutEditor.displayName = 'TradeFormLayoutEditor';
