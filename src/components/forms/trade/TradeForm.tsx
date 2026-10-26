

import React, { useEffect, useState } from 'react';
import { TradeFormData, TradeFormErrors, TradeFormProps } from './types';
import { BasicTab, DetailsTab, AdvancedTab } from './tabs';
import { useTradeForm } from './hooks';
import { useTradeFormNavigation } from './hooks/useTradeFormNavigation';
import { DateDraftGateContext } from '../../core/DateDraftGate';
import { BacktestSessionDayContext } from './executionDates';
import { FormActions, ManualTradeImportNudge } from './components';
import { t, tPlural } from '../../../lang/helpers';
import { usePlugin } from '../../../hooks/usePlugin';
import { SlidersHorizontal } from '../../shared/icons/ObsidianIcon';
import { ForexPnlConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { PercentValue, PnLValue } from '../../shared/display/DisplayValue';
import type { TradeFormLayoutSettings } from '../../../settings/types';
import {
  getResolvedTradeFormLayout,
  hasPopulatedTradeFormLayoutItem,
  isTradeFormLayoutItemVisible,
  TRADE_FORM_DETAILS_ITEM_IDS,
} from './tradeFormLayoutConfig';
import {
  getPartialExitInfo,
  hasRealizedPnLComponents,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import {
  areSnapshotKeysClaimedByCustomFields,
  calculateSnapshotRealizedPnL,
  calculateUnrealizedPnL,
} from '../../../utils/unrealizedPnl';
import {
  calculatePercentageReturn,
  calculatePnL,
  calculateTotalCosts,
  resolveEffectiveRiskAmount,
} from './validation';

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
  'forexPnlConversionRate',
  'currencyPair',
  'cryptoExchange',
  'tradingPair',
  'leverageRatio',
  'directPnL',
  'stopLosses',
  'stopLossesTotal',
  'takeProfits',
  'takeProfitsTotal',
  'riskAmount',
  'unrealizedPriceSnapshot',
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


const showsManualImportNudge = ({
  isEditMode,
  isImportShortcutVisible,
  formData,
}: {
  isEditMode: boolean;
  isImportShortcutVisible: boolean;
  formData: Partial<TradeFormData>;
}): boolean =>
  !isEditMode &&
  isImportShortcutVisible &&
  formData.isMissedTrade !== true &&
  formData.isBacktestTrade !== true;

const pnlPreviewDefaults = (
  data: Partial<TradeFormData>,
  plugin: ReturnType<typeof usePlugin>
) => ({
  currency: data.currency || plugin?.settings.general?.currency || 'USD',
  defaultRiskAmount: plugin?.settings.trade.defaultRiskAmount ?? 0,
});

const hasForexPnlConversion = (data: Partial<TradeFormData>): boolean =>
  data.assetType === 'forex' &&
  data.useDirectPnLInput !== true &&
  typeof data.lotSize === 'number' &&
  data.lotSize > 0 &&
  typeof data.forexPnlConversionRate === 'number' &&
  data.forexPnlConversionRate > 0;

const rMultipleConverter =
  (effectiveRiskAmount: number | undefined) =>
  (value: number): number | undefined =>
    effectiveRiskAmount && effectiveRiskAmount > 0
      ? value / effectiveRiskAmount
      : undefined;

const hasSyncedTradeIdentity = (data: Partial<TradeFormData>): boolean =>
  data.backendTradeId !== undefined ||
  (typeof data.canonicalTradeId === 'string' &&
    data.canonicalTradeId.trim().length > 0);


const currentRealizedPnLOf = (
  data: Partial<TradeFormData>,
  formPnL: number
): number =>
  hasSyncedTradeIdentity(data) &&
  typeof data.pnl === 'number' &&
  Number.isFinite(data.pnl)
    ? data.pnl
    : formPnL;

const closedCountSuffixOf = (data: Partial<TradeFormData>): string => {
  const partialInfo = getPartialExitInfo(data);
  return partialInfo.isPartialExit
    ? ` (${partialInfo.closedSize}/${partialInfo.totalSize} ${t('form.field.closed')})`
    : '';
};

const openPnlHeadline = (
  showBreakdown: boolean,
  hasUnrealized: boolean,
  closedCountSuffix: string
): string => {
  if (showBreakdown) return t('form.field.floating-pnl');
  if (hasUnrealized) return t('form.unrealized.preview');
  return `${t('form.field.realized-pnl')}${closedCountSuffix}`;
};

const canShowClosedPnlPreview = (data: Partial<TradeFormData>): boolean =>
  (data.useDirectPnLInput === true && data.directPnL !== undefined) ||
  (data.entryPrice !== undefined &&
    data.exitPrice !== undefined &&
    data.positionSize !== undefined &&
    data.direction !== undefined);

interface PnlPreviewContext {
  currency: string;
  toRMultiple: (value: number) => number | undefined;
  costsSuffix: string;
  forexConversionInfo: React.ReactNode;
  costsLine: React.ReactNode;
}

function OpenTradePnlPreview({
  data,
  formPnL,
  unrealizedPnL,
  hasRealizedComponents,
  context,
}: {
  data: Partial<TradeFormData>;
  formPnL: number;
  unrealizedPnL: number | null;
  hasRealizedComponents: boolean;
  context: PnlPreviewContext;
}) {
  const { currency, toRMultiple } = context;
  const realizedPnL = hasRealizedComponents
    ? calculateSnapshotRealizedPnL(data, currentRealizedPnLOf(data, formPnL))
    : 0;
  const combinedPnL = realizedPnL + (unrealizedPnL ?? 0);
  const closedCountSuffix = closedCountSuffixOf(data);
  const breakdownUnrealizedPnL = hasRealizedComponents ? unrealizedPnL : null;
  const showBreakdown = breakdownUnrealizedPnL !== null;

  return (
    <div className="calculatedValue calculatedValue--footer">
      <span className="calculatedLabel">
        {openPnlHeadline(
          showBreakdown,
          unrealizedPnL !== null,
          closedCountSuffix
        )}
        {context.costsSuffix}
        {context.forexConversionInfo}
      </span>
      <PnLValue
        className="calculatedAmount"
        value={combinedPnL}
        currencyCode={currency}
        showCents={true}
        rMultiple={toRMultiple(combinedPnL)}
      />
      {breakdownUnrealizedPnL !== null && (
        <>
          <span className="calculatedLabel">
            {t('form.field.realized-pnl')}
            {closedCountSuffix}{' '}
            <PnLValue
              value={realizedPnL}
              currencyCode={currency}
              showCents={true}
              rMultiple={toRMultiple(realizedPnL)}
            />
          </span>
          <span className="calculatedLabel">
            {t('form.unrealized.preview')}{' '}
            <PnLValue
              value={breakdownUnrealizedPnL}
              currencyCode={currency}
              showCents={true}
              rMultiple={toRMultiple(breakdownUnrealizedPnL)}
            />
          </span>
        </>
      )}
      {context.costsLine}
    </div>
  );
}

function ClosedTradePnlPreview({
  data,
  formPnL,
  context,
}: {
  data: Partial<TradeFormData>;
  formPnL: number;
  context: PnlPreviewContext;
}) {
  return (
    <div className="calculatedValue calculatedValue--footer">
      <span className="calculatedLabel">
        {t('form.field.profit-loss')}
        {context.costsSuffix}
        {context.forexConversionInfo}
      </span>
      <PnLValue
        className="calculatedAmount"
        value={formPnL}
        currencyCode={context.currency}
        showCents={true}
        rMultiple={context.toRMultiple(formPnL)}
      />
      {!data.useDirectPnLInput && (
        <span className="calculatedLabel">
          (
          <PercentValue
            kind="returnPercent"
            value={calculatePercentageReturn(data)}
            tone="none"
          />
          )
        </span>
      )}
      {context.costsLine}
    </div>
  );
}

function TradeCostsLine({
  totalCosts,
  currency,
  toRMultiple,
}: {
  totalCosts: number;
  currency: string;
  toRMultiple: (value: number) => number | undefined;
}) {
  return (
    <span className="calculatedLabel">
      {t('form.field.total-costs')}{' '}
      <PnLValue
        value={totalCosts}
        currencyCode={currency}
        showCents={true}
        rMultiple={toRMultiple(totalCosts)}
        tone="none"
      />
    </span>
  );
}

function TradeFormFooterPnlPreview({ data }: { data: Partial<TradeFormData> }) {
  const plugin = usePlugin();
  const { currency, defaultRiskAmount } = pnlPreviewDefaults(data, plugin);
  const isOpen = isTradeOpenWithContext({
    tradeStatus: data.tradeStatus,
    exitTime: data.exitTime,
    exitPrice: data.exitPrice,
    pnl: data._originalPnlWasNull ? null : data.pnl,
    useDirectPnLInput: data.useDirectPnLInput,
    exits: data.exits,
    entries: data.entries,
  });
  
  
  const unrealizedPnL =
    isOpen &&
    !areSnapshotKeysClaimedByCustomFields(
      plugin?.customFieldsService?.getFields()
    )
      ? calculateUnrealizedPnL(data)
      : null;
  const hasRealizedComponents = isOpen && hasRealizedPnLComponents(data);

  const formPnL = calculatePnL(data);
  const toRMultiple = rMultipleConverter(
    resolveEffectiveRiskAmount(data, defaultRiskAmount)
  );
  const hasCosts = Boolean(data.commission || data.swap || data.fees);
  const context: PnlPreviewContext = {
    currency,
    toRMultiple,
    costsSuffix: hasCosts ? ` ${t('form.field.incl-costs')}` : '',
    forexConversionInfo: hasForexPnlConversion(data) ? (
      <ForexPnlConversionInfo
        quoteCurrency={data.forexQuoteCurrency}
        accountCurrency={currency}
        rateDate={data.forexPnlConversionRateDate}
        source={data.forexPnlConversionRateSource}
      />
    ) : null,
    costsLine: hasCosts ? (
      <TradeCostsLine
        totalCosts={calculateTotalCosts(data)}
        currency={currency}
        toRMultiple={toRMultiple}
      />
    ) : null,
  };

  
  
  if (isOpen && (unrealizedPnL !== null || hasRealizedComponents)) {
    return (
      <OpenTradePnlPreview
        data={data}
        formPnL={formPnL}
        unrealizedPnL={unrealizedPnL}
        hasRealizedComponents={hasRealizedComponents}
        context={context}
      />
    );
  }

  if (!canShowClosedPnlPreview(data)) return null;

  return (
    <ClosedTradePnlPreview data={data} formPnL={formPnL} context={context} />
  );
}

function applySavedLayoutToTradeForm({
  layout,
  isEditMode,
  startedAsOpenTrade,
  initialData,
  formData,
  setLayoutOverride,
  handleFieldChange,
}: {
  layout: TradeFormLayoutSettings;
  isEditMode: boolean;
  startedAsOpenTrade: boolean;
  initialData: Partial<TradeFormData>;
  formData: Partial<TradeFormData>;
  setLayoutOverride: React.Dispatch<
    React.SetStateAction<ResolvedTradeFormLayout | null>
  >;
  handleFieldChange: TradeFormFieldChangeHandler;
}) {
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
}


const emptyAccounts: Array<{ id: string; name: string }> = [];

const emptySetups: Array<{ id: string; name: string }> = [];

const emptyMistakes: Array<{ id: string; name: string }> = [];

const emptyInstruments: Array<{ id: string; name: string }> = [];

const emptyTags: string[] = [];

export const TradeForm: React.FC<TradeFormProps> = ({
  initialData = EMPTY_INITIAL_TRADE_DATA,
  initialTab = 'basic',
  isSubmitting = false,
  isEditMode = false,
  onSubmit,
  onCancel,
  dirtyStateRef,
  onOpenCustomization,
  active = true,
}) => {
  const plugin = usePlugin();
  const [layoutOverride, setLayoutOverride] =
    useState<ResolvedTradeFormLayout | null>(null);
  const savedTradeFormLayout = plugin?.settings.trade.tradeFormLayout;
  const tradeFormLayout = React.useMemo(
    () => layoutOverride ?? getResolvedTradeFormLayout(savedTradeFormLayout),
    [layoutOverride, savedTradeFormLayout]
  );
  const [startedAsOpenTrade] = useState(() =>
    isOpenTradeFormData(initialData ?? EMPTY_INITIAL_TRADE_DATA)
  );

  
  const {
    formData,
    backtestSessionDay,
    errors,
    submissionState,
    formRef,
    dateDraftGate,
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

  const { effectiveActiveTab, handleTabChange, handleOpenLayoutSettings } =
    useTradeFormNavigation({
      initialTab,
      canShowDetailsTab,
      canShowAdvancedTab,
      isSubmitting,
      dateDraftGate,
      onOpenCustomization,
      applySavedLayout: (layout) =>
        applySavedLayoutToTradeForm({
          layout,
          isEditMode,
          startedAsOpenTrade,
          initialData,
          formData,
          setLayoutOverride,
          handleFieldChange,
        }),
    });

  
  

  

  const handleCustomFieldChange = (fieldId: string, value: unknown) => {
    const newCustomFieldValues = {
      ...customFieldValues,
      [fieldId]: value,
    };

    handleFieldChange('customFields', newCustomFieldValues);
  };

  
  const tabs = createTradeFormTabs({
    canShowDetailsTab,
    canShowAdvancedTab,
    tabErrorCounts,
  });

  const getTabContent = () => {
    switch (effectiveActiveTab) {
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
            active={active}
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

  const handleOpenTradeImport = async () => {
    if (!plugin) return;
    const didClose = await handleCancel();
    if (!didClose) return;

    void plugin.viewManager.openCSVImportView();
  };

  const isImportShortcutVisible = isTradeFormLayoutItemVisible(
    tradeFormLayout,
    'importShortcut'
  );

  return (
    <DateDraftGateContext.Provider value={dateDraftGate}>
      <BacktestSessionDayContext.Provider value={backtestSessionDay}>
        <form
          ref={formRef}
          className="formContainer"
          onSubmit={(event) => void handleSubmit(event)}
        >
          
          <TradeFormTabNav
            tabs={tabs}
            activeTab={effectiveActiveTab}
            isEditMode={isEditMode}
            showLayoutSettings={!!plugin && !!onOpenCustomization}
            onTabChange={handleTabChange}
            onOpenLayoutSettings={handleOpenLayoutSettings}
          />

          <TradeFormErrorSummary
            errors={errors}
            tabErrorCounts={tabErrorCounts}
          />

          {plugin &&
            showsManualImportNudge({
              isEditMode,
              isImportShortcutVisible,
              formData,
            }) && (
              <ManualTradeImportNudge
                plugin={plugin}
                disabled={isSubmitting}
                closeForm={handleCancel}
              />
            )}

          
          {getTabContent()}

          
          <FormActions
            onCancel={() => void handleCancel()}
            onImportTrades={
              !!plugin && isImportShortcutVisible
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
                <TradeFormFooterPnlPreview data={formData} />
              ) : null
            }
          />
        </form>
      </BacktestSessionDayContext.Provider>
    </DateDraftGateContext.Provider>
  );
};
