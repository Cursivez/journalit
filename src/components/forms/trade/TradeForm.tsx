

import React, { useEffect, useRef, useState } from 'react';
import { TradeFormData, TradeFormErrors, TradeFormProps } from './types';
import { BasicTab, DetailsTab, AdvancedTab } from './tabs';
import { useTradeForm } from './hooks';
import { FormActions } from './components';
import { t, tPlural } from '../../../lang/helpers';
import { usePlugin } from '../../../hooks/usePlugin';
import { SlidersHorizontal } from '../../shared/icons/ObsidianIcon';
import { PercentValue, PnLValue } from '../../shared/display';
import { openTradeFormLayoutSettingsModal } from './TradeFormLayoutSettingsModal';
import {
  getResolvedTradeFormLayout,
  hasPopulatedTradeFormLayoutItem,
  isTradeFormLayoutItemVisible,
  TRADE_FORM_DETAILS_ITEM_IDS,
} from './tradeFormLayoutConfig';
import { isTradeOpenWithContext } from '../../../utils/tradeStatusUtils';
import {
  calculatePercentageReturn,
  calculatePnL,
  calculateTotalCosts,
  resolveEffectiveRiskAmount,
} from './validation';
import type JournalitPlugin from '../../../main';

const EMPTY_INITIAL_TRADE_DATA: Partial<TradeFormData> = {};
type ResolvedTradeFormLayout = ReturnType<typeof getResolvedTradeFormLayout>;
type ActiveTradeFormTab = NonNullable<TradeFormProps['initialTab']>;
type TradeFormFieldChangeHandler = <K extends keyof TradeFormData>(
  field: K,
  value: TradeFormData[K]
) => void;
const BASIC_TAB_ERROR_FIELDS: Array<keyof TradeFormErrors> = [
  'account',
  'instrument',
  'direction',
  'assetType',
  'form',
  'entries',
  'exits',
  'dividends',
  'entriesExits',
  'entryTime',
  'entryPrice',
  'positionSize',
  'exitTime',
  'exitPrice',
  'commission',
  'commissionType',
  'fees',
  'swap',
  'exchange',
  'strikePrice',
  'optionType',
  'contractSize',
  'expirationDate',
  'dollarPerPoint',
  'tickSize',
  'tickValue',
  'contractSymbol',
  'lotSize',
  'pipValue',
  'currencyPair',
  'cryptoExchange',
  'tradingPair',
  'leverageRatio',
  'directPnL',
  'stopLoss',
  'takeProfits',
  'riskAmount',
];
const DETAILS_TAB_ERROR_FIELDS: Array<keyof TradeFormErrors> = ['setup'];
const ADVANCED_TAB_ERROR_FIELDS: Array<keyof TradeFormErrors> = [
  'customFields',
];

const countFieldErrors = (
  errors: TradeFormErrors,
  fields: Array<keyof TradeFormErrors>
): number =>
  fields.filter((field) => {
    const error = errors[field];
    return error && error !== '';
  }).length;

const isOpenTradeFormData = (data: Partial<TradeFormData>): boolean =>
  (data.tradeStatus === 'OPEN' ||
    data.backendTradeId !== undefined ||
    typeof data.filePath === 'string' ||
    (data.entries ?? []).some(
      (entry) =>
        (entry.price !== undefined && entry.price !== null) ||
        (entry.size !== undefined && entry.size !== null)
    ) ||
    data.entryPrice !== undefined ||
    data.positionSize !== undefined) &&
  isTradeOpenWithContext({
    tradeStatus: data.tradeStatus,
    exitTime: data.exitTime,
    exitPrice: data.exitPrice,
    pnl: data._originalPnlWasNull ? null : data.pnl,
    useDirectPnLInput: data.useDirectPnLInput,
    exits: data.exits,
    entries: data.entries,
  });

interface TradeFormTabDefinition {
  id: ActiveTradeFormTab;
  label: string;
  errorCount: number;
}

interface TabErrorCounts {
  basic: number;
  details: number;
  advanced: number;
}

function getTradeFormTabAvailability({
  tradeFormLayout,
  formData,
  customFieldValues,
  isEditMode,
  tabErrorCounts,
}: {
  tradeFormLayout: ResolvedTradeFormLayout;
  formData: Partial<TradeFormData>;
  customFieldValues: NonNullable<TradeFormData['customFields']>;
  isEditMode: boolean;
  tabErrorCounts: TabErrorCounts;
}): { canShowDetailsTab: boolean; canShowAdvancedTab: boolean } {
  const showDetailsTab = TRADE_FORM_DETAILS_ITEM_IDS.some((itemId) =>
    isTradeFormLayoutItemVisible(tradeFormLayout, itemId)
  );
  const showPopulatedHiddenDetailsTab =
    isEditMode &&
    TRADE_FORM_DETAILS_ITEM_IDS.some(
      (itemId) =>
        !isTradeFormLayoutItemVisible(tradeFormLayout, itemId) &&
        hasPopulatedTradeFormLayoutItem(formData, itemId)
    );
  const showAdvancedTab = isTradeFormLayoutItemVisible(
    tradeFormLayout,
    'customFields'
  );
  const showPopulatedHiddenAdvancedTab =
    isEditMode &&
    !showAdvancedTab &&
    hasPopulatedTradeFormLayoutItem(
      formData,
      'customFields',
      customFieldValues
    );

  return {
    canShowDetailsTab:
      showDetailsTab ||
      showPopulatedHiddenDetailsTab ||
      tabErrorCounts.details > 0,
    canShowAdvancedTab:
      showAdvancedTab ||
      showPopulatedHiddenAdvancedTab ||
      tabErrorCounts.advanced > 0,
  };
}

function createTradeFormTabs({
  canShowDetailsTab,
  canShowAdvancedTab,
  tabErrorCounts,
}: {
  canShowDetailsTab: boolean;
  canShowAdvancedTab: boolean;
  tabErrorCounts: TabErrorCounts;
}): TradeFormTabDefinition[] {
  const tabs: TradeFormTabDefinition[] = [
    {
      id: 'basic',
      label: t('form.tab.basic'),
      errorCount: tabErrorCounts.basic,
    },
  ];

  if (canShowDetailsTab) {
    tabs.push({
      id: 'details',
      label: t('form.tab.details'),
      errorCount: tabErrorCounts.details,
    });
  }

  if (canShowAdvancedTab) {
    tabs.push({
      id: 'advanced',
      label: t('form.tab.advanced'),
      errorCount: tabErrorCounts.advanced,
    });
  }

  return tabs;
}

function TradeFormErrorSummary({
  errors,
  tabErrorCounts,
}: {
  errors: TradeFormErrors;
  tabErrorCounts: TabErrorCounts;
}) {
  if (
    !errors.form &&
    tabErrorCounts.basic === 0 &&
    tabErrorCounts.details === 0 &&
    tabErrorCounts.advanced === 0
  ) {
    return null;
  }

  return (
    <div className="errorSummary">
      <strong>{t('validation.fix-errors')}</strong>
      <ul>
        {errors.form && <li>{errors.form}</li>}
        {tabErrorCounts.basic > 0 && (
          <li>
            {tPlural('validation.basic-tab-errors', tabErrorCounts.basic)}
          </li>
        )}
        {tabErrorCounts.details > 0 && (
          <li>
            {tPlural('validation.details-tab-errors', tabErrorCounts.details)}
          </li>
        )}
        {tabErrorCounts.advanced > 0 && (
          <li>
            {tPlural('validation.advanced-tab-errors', tabErrorCounts.advanced)}
          </li>
        )}
      </ul>
    </div>
  );
}

function TradeFormTabNav({
  tabs,
  activeTab,
  isEditMode,
  showLayoutSettings,
  onTabChange,
  onOpenLayoutSettings,
}: {
  tabs: TradeFormTabDefinition[];
  activeTab: string;
  isEditMode: boolean;
  showLayoutSettings: boolean;
  onTabChange: (tabId: string) => void;
  onOpenLayoutSettings: () => void;
}) {
  return (
    <nav className="journalit-tab-nav">
      <div className="journalit-tab-wrapper">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-journalit-guide-target={`trade-form.${tab.id}-tab`}
            className={`journalit-tab-button ${activeTab === tab.id ? 'journalit-tab-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {tab.errorCount > 0 && (
              <span className="journalit-tab-error-badge">
                {tab.errorCount}
              </span>
            )}
          </button>
        ))}

        {showLayoutSettings && (
          <button
            type="button"
            data-journalit-guide-target="trade-form.customize-button"
            className="journalit-toolbar-icon-button journalit-trade-form-header-action"
            onClick={onOpenLayoutSettings}
            aria-label={t('form.layout.customize')}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="journalit-trade-form-header-actions">
        {isEditMode && (
          <span className="journalit-edit-badge">{t('validation.edit')}</span>
        )}
      </div>
    </nav>
  );
}

function TradeFormFooterPnlPreview({
  data,
  currency,
  defaultRiskAmount,
}: {
  data: Partial<TradeFormData>;
  currency: string;
  defaultRiskAmount: number;
}) {
  const canShowPnlPreview =
    (data.useDirectPnLInput && data.directPnL !== undefined) ||
    (data.entryPrice !== undefined &&
      data.exitPrice !== undefined &&
      data.positionSize !== undefined &&
      data.direction !== undefined);

  if (!canShowPnlPreview) return null;

  const pnl = calculatePnL(data);
  const percentReturn = calculatePercentageReturn(data);
  const effectiveRiskAmount = resolveEffectiveRiskAmount(
    data,
    defaultRiskAmount
  );
  const pnlRMultiple =
    effectiveRiskAmount && effectiveRiskAmount > 0
      ? pnl / effectiveRiskAmount
      : undefined;
  const totalCosts = calculateTotalCosts(data);
  const costsRMultiple =
    effectiveRiskAmount && effectiveRiskAmount > 0
      ? totalCosts / effectiveRiskAmount
      : undefined;

  return (
    <div className="calculatedValue calculatedValue--footer">
      <span className="calculatedLabel">
        {t('form.field.profit-loss')}
        {data.commission || data.swap || data.fees
          ? ` ${t('form.field.incl-costs')}`
          : ''}
      </span>
      <PnLValue
        className="calculatedAmount"
        value={pnl}
        currencyCode={currency}
        showCents={true}
        rMultiple={pnlRMultiple}
      />
      {!data.useDirectPnLInput && (
        <span className="calculatedLabel">
          (
          <PercentValue
            kind="returnPercent"
            value={percentReturn}
            tone="none"
          />
          )
        </span>
      )}
      {data.commission || data.swap || data.fees ? (
        <span className="calculatedLabel">
          {t('form.field.total-costs')}{' '}
          <PnLValue
            value={totalCosts}
            currencyCode={currency}
            showCents={true}
            rMultiple={costsRMultiple}
            tone="none"
          />
        </span>
      ) : null}
    </div>
  );
}

function openLayoutSettingsForTradeForm({
  plugin,
  isEditMode,
  startedAsOpenTrade,
  initialData,
  formData,
  setLayoutOverride,
  handleFieldChange,
}: {
  plugin: JournalitPlugin;
  isEditMode: boolean;
  startedAsOpenTrade: boolean;
  initialData: Partial<TradeFormData>;
  formData: Partial<TradeFormData>;
  setLayoutOverride: React.Dispatch<
    React.SetStateAction<ResolvedTradeFormLayout | null>
  >;
  handleFieldChange: TradeFormFieldChangeHandler;
}) {
  openTradeFormLayoutSettingsModal({
    app: plugin.app,
    plugin,
    onSave: (layout) => {
      setLayoutOverride(layout);
      if (
        layout.inputMode === 'pnl-risk' &&
        !isEditMode &&
        !startedAsOpenTrade &&
        !isOpenTradeFormData(formData)
      ) {
        if (!('directPnL' in initialData) && formData.directPnL === 0) {
          handleFieldChange('directPnL', undefined);
        }
        handleFieldChange('useDirectPnLInput', true);
      }
      if (
        !isEditMode &&
        layout.assetTypeMode === 'fixed' &&
        formData.assetType !== layout.defaultAssetType
      ) {
        handleFieldChange('assetType', layout.defaultAssetType);
      }
    },
  });
}


export const TradeForm: React.FC<TradeFormProps> = ({
  initialData = EMPTY_INITIAL_TRADE_DATA,
  initialTab = 'basic',
  isSubmitting = false,
  isEditMode = false,
  onSubmit,
  onCancel,
  dirtyStateRef,
}) => {
  const initialActiveTabRef = useRef(initialTab);
  const plugin = usePlugin();
  const [layoutOverride, setLayoutOverride] =
    useState<ResolvedTradeFormLayout | null>(null);
  const savedTradeFormLayout = plugin?.settings.trade.tradeFormLayout;
  const tradeFormLayout = React.useMemo(
    () => layoutOverride ?? getResolvedTradeFormLayout(savedTradeFormLayout),
    [layoutOverride, savedTradeFormLayout]
  );
  const startedAsOpenTradeRef = useRef(
    isOpenTradeFormData(initialData ?? EMPTY_INITIAL_TRADE_DATA)
  );
  const startedAsOpenTrade = startedAsOpenTradeRef.current;

  
  const {
    formData,
    errors,
    submissionState,
    formRef,
    handleFieldChange,
    handleAddImage,
    deleteImageFile,
    handleSubmit,
    handleCancel,
    isDirty,
  } = useTradeForm({
    initialData,
    isEditMode,
    onSubmit,
    onCancel,
    layout: tradeFormLayout,
  });

  if (dirtyStateRef) {
    dirtyStateRef.current = isDirty;
  }

  
  const [activeTab, setActiveTab] = useState<ActiveTradeFormTab>(
    initialActiveTabRef.current
  );
  const [isAccountCreationBlocked, setIsAccountCreationBlocked] =
    useState(false);
  const customFieldValues = formData.customFields ?? {};

  
  const tabErrorCounts = React.useMemo(() => {
    return {
      basic: countFieldErrors(errors, BASIC_TAB_ERROR_FIELDS),
      details: countFieldErrors(errors, DETAILS_TAB_ERROR_FIELDS),
      advanced: countFieldErrors(errors, ADVANCED_TAB_ERROR_FIELDS),
    };
  }, [errors]); 

  const { canShowDetailsTab, canShowAdvancedTab } = getTradeFormTabAvailability(
    {
      tradeFormLayout,
      formData,
      customFieldValues,
      isEditMode,
      tabErrorCounts,
    }
  );

  useEffect(() => {
    if (
      tradeFormLayout.inputMode === 'pnl-risk' &&
      !isEditMode &&
      !formData.useDirectPnLInput &&
      !startedAsOpenTrade &&
      !isOpenTradeFormData(formData)
    ) {
      if (!('directPnL' in initialData) && formData.directPnL === 0) {
        handleFieldChange('directPnL', undefined);
      }
      handleFieldChange('useDirectPnLInput', true);
    }
  }, [
    formData,
    handleFieldChange,
    initialData,
    isEditMode,
    startedAsOpenTrade,
    tradeFormLayout.inputMode,
  ]);

  useEffect(() => {
    if (
      !isEditMode &&
      tradeFormLayout.assetTypeMode === 'fixed' &&
      formData.assetType !== tradeFormLayout.defaultAssetType
    ) {
      handleFieldChange('assetType', tradeFormLayout.defaultAssetType);
    }
  }, [
    formData.assetType,
    handleFieldChange,
    isEditMode,
    tradeFormLayout.assetTypeMode,
    tradeFormLayout.defaultAssetType,
  ]);

  useEffect(() => {
    if (activeTab === 'details' && !canShowDetailsTab) {
      setActiveTab('basic');
      return;
    }

    if (activeTab === 'advanced' && !canShowAdvancedTab) {
      setActiveTab('basic');
    }
  }, [activeTab, canShowAdvancedTab, canShowDetailsTab]);

  
  
  const emptyAccounts: Array<{ id: string; name: string }> = [];
  const emptySetups: Array<{ id: string; name: string }> = [];
  const emptyMistakes: Array<{ id: string; name: string }> = [];
  const emptyInstruments: Array<{ id: string; name: string }> = [];
  const emptyTags: string[] = [];

  

  const handleCustomFieldChange = (fieldId: string, value: unknown) => {
    const newCustomFieldValues = {
      ...customFieldValues,
      [fieldId]: value,
    };

    handleFieldChange('customFields', newCustomFieldValues);
  };

  
  const handleTabChange = (newTab: ActiveTradeFormTab) => {
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  
  const tabs = createTradeFormTabs({
    canShowDetailsTab,
    canShowAdvancedTab,
    tabErrorCounts,
  });

  const getTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicTab
            data={formData}
            errors={errors}
            onChange={handleFieldChange}
            instruments={emptyInstruments}
            onAccountRequirementChange={setIsAccountCreationBlocked}
            layout={tradeFormLayout}
            forcePriceInputMode={startedAsOpenTrade}
            isEditMode={isEditMode}
          />
        );
      case 'details':
        return (
          <DetailsTab
            data={formData}
            errors={errors}
            onChange={handleFieldChange}
            accounts={emptyAccounts}
            setups={emptySetups}
            mistakes={emptyMistakes}
            availableTags={emptyTags}
            onAddImage={handleAddImage}
            onDeleteImage={deleteImageFile}
            layout={tradeFormLayout}
            isEditMode={isEditMode}
          />
        );
      case 'advanced':
        return (
          <AdvancedTab
            data={formData}
            errors={errors}
            onChange={handleFieldChange}
            customFieldValues={customFieldValues}
            onCustomFieldChange={handleCustomFieldChange}
            layout={tradeFormLayout}
            isEditMode={isEditMode}
          />
        );
      default:
        return null;
    }
  };

  const handleOpenLayoutSettings = () => {
    if (!plugin) return;

    openLayoutSettingsForTradeForm({
      plugin,
      isEditMode,
      startedAsOpenTrade,
      initialData,
      formData,
      setLayoutOverride,
      handleFieldChange,
    });
  };

  const handleOpenTradeImport = async () => {
    if (!plugin) return;
    const didClose = await handleCancel();
    if (!didClose) return;

    void plugin.viewManager.openCSVImportView();
  };

  return (
    <form
      ref={formRef}
      className="formContainer"
      onSubmit={(event) => void handleSubmit(event)}
    >
      
      <TradeFormErrorSummary errors={errors} tabErrorCounts={tabErrorCounts} />

      
      <TradeFormTabNav
        tabs={tabs}
        activeTab={activeTab}
        isEditMode={isEditMode}
        showLayoutSettings={!!plugin}
        onTabChange={handleTabChange}
        onOpenLayoutSettings={handleOpenLayoutSettings}
      />

      
      {getTabContent()}

      
      <FormActions
        onCancel={() => void handleCancel()}
        onImportTrades={
          !!plugin &&
          isTradeFormLayoutItemVisible(tradeFormLayout, 'importShortcut')
            ? () => void handleOpenTradeImport()
            : undefined
        }
        isSubmitting={isSubmitting}
        errors={errors}
        submissionState={submissionState}
        isEditMode={isEditMode}
        hasEntryTime={!!initialData.entryTime}
        disabledReason={
          isAccountCreationBlocked
            ? t('form.account-empty-state.submit-disabled')
            : undefined
        }
        footerSummary={
          isTradeFormLayoutItemVisible(tradeFormLayout, 'pnlPreview') ? (
            <TradeFormFooterPnlPreview
              data={formData}
              currency={
                formData.currency || plugin?.settings.general?.currency || 'USD'
              }
              defaultRiskAmount={plugin?.settings.trade.defaultRiskAmount ?? 0}
            />
          ) : null
        }
      />
    </form>
  );
};
