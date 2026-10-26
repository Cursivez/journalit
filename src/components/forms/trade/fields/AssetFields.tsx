

import {
  DEFAULT_OPTION_CONTRACT_SIZE,
  resolveInstrumentContractDefaults,
} from '../../../../services/trade/instrumentContractDefaults';
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Notice } from 'obsidian';
import { NumberInput } from '../../../core/NumberInput';
import { ComboBox } from '../../../core/ComboBox';
import { Select } from '../../../core/Select';
import { Button } from '../../../ui/Button';
import { RMultipleValue } from '../../../shared/display/DisplayValue';
import { FormSection } from '../FormSection';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import {
  calculatePnL,
  calculateStopLossRiskAmount,
  canCalculateStopLossRiskAmount,
  resolveEffectiveRiskAmount,
  resolveTakeProfitClosePercent,
  resolveTakeProfitCloseSize,
} from '../validation';
import { formatPnL } from '../../../../utils/formatting';
import { formatCost } from '../../../../utils/formatting';
import { isTradeOpenWithContext } from '../../../../utils/tradeStatusUtils';
import { OptionType } from '../../../../services/options';
import { getPluginInstance } from '../../../../utils/pluginContext';
import { areSnapshotKeysClaimedByCustomFields } from '../../../../utils/unrealizedPnl';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { getCurrencyOptions } from '../../../../utils/currencyConfig';
import { debounce } from '../../../../utils/debounce';
import { calculateAssetAdjustedPriceMoveValue } from '../../../../utils/priceMoveValue';
import { useEventBus } from '../../../../hooks/useEventBus';
import { t } from '../../../../lang/helpers';
import { filterActiveCopyAccounts } from '../../../../utils/accountCopyTrading';
import { normalizeAccountLookupKey } from '../../../../services/trade/core/TradeAccountIdentity';
import type { AccountCatalogEntry } from '../../../../services/accountPage/types';
import {
  TradeFormInputMode,
  TradeFormLayoutItemId,
  TradeFormLayoutSettings,
  TradeFormTakeProfitUnit,
  resolveTradeFormLayoutSettings,
} from '../../../../settings/types';
import { resolvePropChallengePhaseAt } from '../../../../services/propChallenge/PropChallengeConfig';
import { getPricePrecision, getSizePrecision } from '../utils';
import {
  getEditAwareVisibleOrderedTradeFormLayoutItems,
  hasPopulatedTradeFormLayoutItem,
  isTradeFormLayoutItemVisible,
  TRADE_FORM_BASIC_OPTIONAL_ITEM_IDS,
} from '../tradeFormLayoutConfig';


import { StockFields } from './StockFields';
import { OptionsFields } from './OptionsFields';
import { FuturesFields } from './FuturesFields';
import { ForexFields } from './ForexFields';
import { CryptoFields } from './CryptoFields';
import { CFDFields } from './CFDFields';
import { EntryExitFields } from './EntryExitFields';
import { PlannedPriceTargetList } from './PlannedPriceTargetList';
import { StopLossesSection } from './StopLossesSection';
import { openCreateAccountModal } from '../../../accountPage/components/CreateAccountModal';
import { useForexPnlConversionRate } from './hooks/useForexPnlConversionRate';

const parseCommissionType = (value: string): 'fixed' | 'percentage' =>
  value === 'percentage' ? 'percentage' : 'fixed';

const EMPTY_INSTRUMENTS: Array<{ id: string; name: string }> = [];

function mergeActiveTradeFormAccountNames(
  catalogAccounts: ReadonlyArray<
    Pick<AccountCatalogEntry, 'name' | 'archived'>
  >,
  uniqueAccounts: readonly string[]
): string[] {
  const archivedLookupKeys = new Set<string>();
  const activeAccountsByLookupKey = new Map<string, string>();

  for (const account of catalogAccounts) {
    const lookupKey = normalizeAccountLookupKey(account.name);
    if (!lookupKey) {
      continue;
    }
    if (account.archived) {
      archivedLookupKeys.add(lookupKey);
    } else {
      activeAccountsByLookupKey.set(lookupKey, account.name);
    }
  }

  for (const accountName of uniqueAccounts) {
    const lookupKey = normalizeAccountLookupKey(accountName);
    if (
      lookupKey &&
      !archivedLookupKeys.has(lookupKey) &&
      !activeAccountsByLookupKey.has(lookupKey)
    ) {
      activeAccountsByLookupKey.set(lookupKey, accountName);
    }
  }

  return Array.from(activeAccountsByLookupKey.values());
}

const ASSET_SPECIFIC_ERROR_FIELDS: Array<keyof TradeFormErrors> = [
  'expirationDate',
  'strikePrice',
  'optionType',
  'contractSize',
  'contractSymbol',
  'dollarPerPoint',
  'tickSize',
  'tickValue',
  'currencyPair',
  'lotSize',
  'pipValue',
  'forexPnlConversionRate',
  'tradingPair',
  'leverageRatio',
];

const hasAssetSpecificValidationErrors = (errors: TradeFormErrors): boolean =>
  ASSET_SPECIFIC_ERROR_FIELDS.some((field) => Boolean(errors[field]));


function shouldShowDirectPnlToggle({
  isLayoutVisible,
  isEditMode,
  data,
  hasDirectPnlError,
}: {
  isLayoutVisible: boolean;
  isEditMode: boolean;
  data: Partial<TradeFormData>;
  hasDirectPnlError: boolean;
}): boolean {
  return (
    isLayoutVisible ||
    (isEditMode && hasPopulatedTradeFormLayoutItem(data, 'directPnlToggle')) ||
    hasDirectPnlError
  );
}

const shouldShowTradingCostsSection = (
  layout: TradeFormLayoutSettings,
  errors: TradeFormErrors
): boolean =>
  isTradeFormLayoutItemVisible(layout, 'tradingCosts') ||
  isTradeFormLayoutItemVisible(layout, 'tradingCostRebate') ||
  isTradeFormLayoutItemVisible(layout, 'tradingCostSwap') ||
  isTradeFormLayoutItemVisible(layout, 'tradingCostFees') ||
  Boolean(
    errors.commission ||
    errors.commissionType ||
    errors.rebate ||
    errors.swap ||
    errors.fees
  );

const shouldShowRebateField = (
  data: Partial<TradeFormData>,
  errors: TradeFormErrors
): boolean => data.assetType === 'options' || Boolean(errors.rebate);

function resolveEffectiveTradeFormInputMode({
  layoutInputMode,
  forcePriceInputMode,
  isOpenTrade,
  useDirectPnLInput,
}: {
  layoutInputMode: TradeFormInputMode;
  forcePriceInputMode: boolean;
  isOpenTrade: boolean;
  useDirectPnLInput?: boolean;
}): TradeFormInputMode {
  if (forcePriceInputMode || isOpenTrade) return 'prices';
  if (layoutInputMode === 'prices') return 'prices';
  if (useDirectPnLInput === false) return 'prices';

  return layoutInputMode;
}

const hasOpenTradeEvidence = (data: Partial<TradeFormData>): boolean =>
  data.tradeStatus === 'OPEN' ||
  data.backendTradeId !== undefined ||
  typeof data.filePath === 'string' ||
  (data.entries ?? []).some(
    (entry) =>
      (entry.price !== undefined && entry.price !== null) ||
      (entry.size !== undefined && entry.size !== null)
  ) ||
  data.entryPrice !== undefined ||
  data.positionSize !== undefined;

interface AssetFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  
  instruments?: Array<{ id: string; name: string }>;
  
  onAccountRequirementChange?: (isBlocked: boolean) => void;
  
  layout: TradeFormLayoutSettings;
  
  forcePriceInputMode?: boolean;
  
  isEditMode: boolean;
}



interface TradingCostsSectionProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  pnlCurrency: string;
  shouldDisplaySwap: boolean;
  visibleCostGroups: TradeFormLayoutItemId[];
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

const hasNonZeroSwap = (data: Partial<TradeFormData>): boolean =>
  data.swap !== undefined && data.swap !== null && data.swap !== 0;


const tradingCostVisibility = ({
  data,
  errors,
  shouldDisplaySwap,
  visibleCostGroups,
}: Pick<
  TradingCostsSectionProps,
  'data' | 'errors' | 'shouldDisplaySwap' | 'visibleCostGroups'
>) => ({
  showCommission:
    visibleCostGroups.includes('tradingCosts') ||
    Boolean(errors.commission || errors.commissionType),
  showRebate:
    (visibleCostGroups.includes('tradingCostRebate') &&
      shouldShowRebateField(data, errors)) ||
    Boolean(errors.rebate),
  showSwap:
    (visibleCostGroups.includes('tradingCostSwap') &&
      (shouldDisplaySwap || hasNonZeroSwap(data))) ||
    Boolean(errors.swap),
  showFees:
    visibleCostGroups.includes('tradingCostFees') || Boolean(errors.fees),
});

function CommissionFields({
  data,
  errors,
  pnlCurrency,
  onChange,
}: Pick<
  TradingCostsSectionProps,
  'data' | 'errors' | 'pnlCurrency' | 'onChange'
>) {
  return (
    <div className="field trading-costs-field trading-costs-field--commission">
      <div className="commission-grid">
        <NumberInput
          label={t('form.field.commission')}
          value={data.commission}
          onChange={(value) => onChange('commission', value)}
          error={errors.commission || errors.commissionType}
          precision={2}
          allowDecimal={true}
          placeholder={
            data.commissionType === 'percentage'
              ? t('form.placeholder.commission')
              : t('form.placeholder.commission-alt')
          }
        />
        <Select
          label={t('form.field.commission-type')}
          options={[
            {
              value: 'fixed',
              label: `${t('form.field.commission-type.fixed')} ${formatCost(0, pnlCurrency).replace('0', '').trim()}`,
            },
            {
              value: 'percentage',
              label: t('form.field.commission-type.percentage'),
            },
          ]}
          value={data.commissionType || 'fixed'}
          onChange={(value) =>
            onChange('commissionType', parseCommissionType(value))
          }
        />
      </div>
    </div>
  );
}

function TradingCostsSection({
  data,
  errors,
  pnlCurrency,
  shouldDisplaySwap,
  visibleCostGroups,
  onChange,
}: TradingCostsSectionProps) {
  const { showCommission, showRebate, showSwap, showFees } =
    tradingCostVisibility({
      data,
      errors,
      shouldDisplaySwap,
      visibleCostGroups,
    });
  return (
    <div className="trading-costs-section">
      <h4 className="section-title">{t('form.section.trading-costs')}</h4>
      <div
        className={`cost-fields ${shouldDisplaySwap ? 'three-column' : 'two-column'}`}
      >
        {showCommission && (
          <CommissionFields
            data={data}
            errors={errors}
            pnlCurrency={pnlCurrency}
            onChange={onChange}
          />
        )}

        {showRebate && (
          <div className="field trading-costs-field">
            <NumberInput
              label={t('form.field.rebate')}
              value={data.rebate}
              onChange={(value) => onChange('rebate', value)}
              error={errors.rebate}
              precision={2}
              allowDecimal={true}
              min={0}
              placeholder={t('form.placeholder.rebate')}
            />
          </div>
        )}

        {showSwap && (
          <div className="field trading-costs-field">
            <NumberInput
              label={t('form.field.swap')}
              value={data.swap}
              onChange={(value) => onChange('swap', value)}
              error={errors.swap}
              precision={2}
              allowDecimal={true}
              placeholder={t('form.placeholder.swap')}
            />
          </div>
        )}

        {showFees && (
          <div className="field trading-costs-field">
            <NumberInput
              label={t('form.field.other-fees')}
              value={data.fees}
              onChange={(value) => onChange('fees', value)}
              error={errors.fees}
              precision={2}
              allowDecimal={true}
              placeholder={t('form.placeholder.other-fees')}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function AccountSelectField({
  data,
  errors,
  accountOptions,
  onChange,
  onRequestCreateAccount,
}: {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  accountOptions: string[];
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  onRequestCreateAccount: (name: string) => void;
}) {
  return (
    <ComboBox
      label={t('form.field.account')}
      options={accountOptions}
      value={Array.isArray(data.account) ? data.account : []}
      onChange={(selectedNames) => {
        
        
        
        
        const previousNames = new Set(
          Array.isArray(data.account) ? data.account : []
        );
        const knownAccountNames = new Set(accountOptions);
        const typedAccountName = selectedNames.find(
          (name) => !previousNames.has(name) && !knownAccountNames.has(name)
        );

        if (typedAccountName !== undefined) {
          
          
          onChange(
            'account',
            selectedNames.filter((name) => name !== typedAccountName)
          );
          onRequestCreateAccount(typedAccountName);
          return;
        }

        onChange('account', selectedNames);
      }}
      error={errors.account}
      
      
      allowCreate={true}
      isMulti={true}
      required={!data.isMissedTrade && !data.isBacktestTrade}
      placeholder={t('form.placeholder.select-accounts')}
    />
  );
}

function coerceFormDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' && value.length > 0) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return undefined;
}


function resolvePhaseAttributionTimestamp(data: Partial<TradeFormData>): Date {
  const entryTime = coerceFormDate(data.entryTime);
  const isOpen =
    hasOpenTradeEvidence(data) &&
    isTradeOpenWithContext({
      tradeStatus: data.tradeStatus,
      exitTime: data.exitTime,
      exitPrice: data.exitPrice,
      pnl: data._originalPnlWasNull ? null : data.pnl,
      useDirectPnLInput: data.useDirectPnLInput,
      exits: data.exits,
      entries: data.entries,
    });
  if (isOpen) return entryTime ?? new Date();
  return coerceFormDate(data.exitTime) ?? entryTime ?? new Date();
}

function PropChallengePhaseHint({ data }: { data: Partial<TradeFormData> }) {
  const plugin = getPluginInstance();
  const selected = Array.isArray(data.account) ? data.account : [];
  const metadata = plugin?.settings.account?.accountMetadata;
  if (!metadata || selected.length === 0) return null;
  const challenged = selected.filter((name) => metadata[name]?.propChallenge);
  if (challenged.length !== 1) return null;
  const config = metadata[challenged[0]]?.propChallenge;
  if (!config) return null;
  const phase = resolvePropChallengePhaseAt(
    config,
    resolvePhaseAttributionTimestamp(data),
    data
  );
  return (
    <div className="journalit-prop-challenge-phase-hint">
      {phase
        ? t('form.field.prop-challenge-phase', { name: phase.name })
        : t('form.field.prop-challenge-phase.none')}
    </div>
  );
}


function AccountEmptyState({
  onCreateAccount,
}: {
  onCreateAccount: () => void | Promise<void>;
}) {
  return (
    <div className="trade-form-account-empty-state" role="status">
      <div className="trade-form-account-empty-state-header">
        <div className="trade-form-account-empty-state-title">
          {t('form.account-empty-state.title')}
        </div>
        <Button
          variant="primary"
          size="small"
          onClick={() => void onCreateAccount()}
          className="trade-form-account-empty-state-button"
        >
          {t('form.account-empty-state.create-account')}
        </Button>
      </div>
      <div className="trade-form-account-empty-state-description">
        {t('form.account-empty-state.description')}
      </div>
    </div>
  );
}

interface TradeCurrencySectionProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  globalCurrency: string;
  tradeCurrencyOptions: Array<{ value: string; label: string }>;
  showManualFxRate: boolean;
  onTradeCurrencyChange: (value: string | undefined) => void;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

function TradeCurrencySection({
  data,
  errors,
  globalCurrency,
  tradeCurrencyOptions,
  showManualFxRate,
  onTradeCurrencyChange,
  onChange,
}: TradeCurrencySectionProps) {
  
  
  const showFxRateInput =
    typeof data.currency === 'string' &&
    data.currency.length > 0 &&
    data.currency !== globalCurrency &&
    (showManualFxRate || data.fxRate !== undefined || Boolean(errors.fxRate));
  
  
  const fxRateValue =
    data.fxRateBaseCurrency === globalCurrency ? data.fxRate : undefined;

  return (
    <div
      className={`trade-currency-section trade-currency-grid ${
        showFxRateInput ? 'trade-currency-grid--paired' : ''
      }`}
    >
      <div className="field">
        <Select
          label={t('form.field.trade-currency')}
          value={data.currency || '__NONE__'}
          onChange={(value) =>
            onTradeCurrencyChange(value === '__NONE__' ? undefined : value)
          }
          options={tradeCurrencyOptions}
          id="trade-currency-block-select"
        />
      </div>
      {showFxRateInput && (
        <div className="field">
          <NumberInput
            label={t('form.field.fx-rate', { base: globalCurrency })}
            value={fxRateValue}
            onChange={(value) => onChange('fxRate', value)}
            error={errors.fxRate}
            allowDecimal={true}
            precision={6}
            min={0}
            placeholder={t('form.placeholder.fx-rate', {
              currency: data.currency ?? '',
              base: globalCurrency,
            })}
          />
        </div>
      )}
    </div>
  );
}

interface RiskManagementSectionProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  pnlCurrency: string;
  pnl: number;
  defaultRiskAmount: number;
  displayRMultiples: boolean;
  visibleRiskGroups: TradeFormLayoutItemId[];
  title?: string;
  showTitle?: boolean;
  showResultPreview?: boolean;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

type RiskFieldId = 'stopLoss' | 'riskAmount' | 'takeProfits' | 'mae' | 'mfe';

interface TakeProfitsSectionProps {
  takeProfits: NonNullable<TradeFormData['takeProfits']>;
  errors: TradeFormErrors;
  pricePrecision: number;
  sizePrecision: number;
  takeProfitUnit: TradeFormTakeProfitUnit;
  positionSize?: number;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

const createTakeProfitClientId = (): string =>
  `take-profit-${Date.now()}-${Math.random().toString(36).slice(2)}`;


const hasCloseAmount = (value: number | undefined): boolean =>
  typeof value === 'number' && Number.isFinite(value);

function TakeProfitsSection({
  takeProfits,
  errors,
  pricePrecision,
  sizePrecision,
  takeProfitUnit,
  positionSize,
  onChange,
}: TakeProfitsSectionProps) {
  const useSizeUnit = takeProfitUnit === 'size';
  const totalPositionSize =
    typeof positionSize === 'number' &&
    Number.isFinite(positionSize) &&
    positionSize > 0
      ? positionSize
      : undefined;
  const roundToSizePrecision = (value: number): number => {
    const factor = 10 ** sizePrecision;
    return Math.round(value * factor) / factor;
  };
  const generatedClientIdsRef = useRef(new WeakMap<object, string>());
  const getTakeProfitKey = (
    target: NonNullable<TradeFormData['takeProfits']>[number]
  ): string => {
    if (target.clientId) {
      return target.clientId;
    }

    const existingId = generatedClientIdsRef.current.get(target);
    if (existingId) {
      return existingId;
    }

    const nextId = createTakeProfitClientId();
    generatedClientIdsRef.current.set(target, nextId);
    return nextId;
  };

  const updateTakeProfit = (
    index: number,
    field: 'price' | 'closePercent' | 'size',
    value: number | undefined
  ) => {
    onChange(
      'takeProfits',
      takeProfits.map((target, targetIndex) => {
        if (targetIndex !== index) return target;
        const nextTarget = {
          ...target,
          clientId: getTakeProfitKey(target),
          [field]: value,
        };
        
        
        if (field === 'closePercent') delete nextTarget.size;
        if (field === 'size') delete nextTarget.closePercent;
        return nextTarget;
      })
    );
  };

  const addTakeProfitBySize = () => {
    const [singleTarget] = takeProfits;
    
    
    
    
    if (
      totalPositionSize !== undefined &&
      takeProfits.length === 1 &&
      !hasCloseAmount(singleTarget.closePercent) &&
      (singleTarget.size === undefined ||
        singleTarget.size === totalPositionSize)
    ) {
      const firstHalf = roundToSizePrecision(totalPositionSize / 2);
      const secondHalf = roundToSizePrecision(totalPositionSize - firstHalf);
      if (firstHalf > 0 && secondHalf > 0) {
        onChange('takeProfits', [
          { ...singleTarget, size: firstHalf },
          { clientId: createTakeProfitClientId(), size: secondHalf },
        ]);
        return;
      }
    }

    
    
    const allocatedSize = takeProfits.reduce(
      (total, target) =>
        total + resolveTakeProfitCloseSize(target, totalPositionSize),
      0
    );
    const remainingSize =
      totalPositionSize !== undefined
        ? roundToSizePrecision(Math.max(0, totalPositionSize - allocatedSize))
        : 0;
    onChange('takeProfits', [
      ...takeProfits,
      {
        clientId: createTakeProfitClientId(),
        size: remainingSize > 0 ? remainingSize : undefined,
      },
    ]);
  };

  const addTakeProfit = () => {
    if (useSizeUnit) {
      addTakeProfitBySize();
      return;
    }

    const [singleTarget] = takeProfits;
    if (
      takeProfits.length === 1 &&
      !hasCloseAmount(singleTarget.size) &&
      (singleTarget.closePercent === undefined ||
        singleTarget.closePercent === 100)
    ) {
      onChange('takeProfits', [
        { ...singleTarget, closePercent: 50 },
        { clientId: createTakeProfitClientId(), closePercent: 50 },
      ]);
      return;
    }

    
    
    const allocatedPercent = takeProfits.reduce(
      (total, target) =>
        total + resolveTakeProfitClosePercent(target, totalPositionSize),
      0
    );
    const remainingPercent = Math.max(0, Math.round(100 - allocatedPercent));
    onChange('takeProfits', [
      ...takeProfits,
      {
        clientId: createTakeProfitClientId(),
        closePercent: remainingPercent || undefined,
      },
    ]);
  };

  const removeTakeProfit = (index: number) => {
    onChange(
      'takeProfits',
      takeProfits.filter((_, targetIndex) => targetIndex !== index)
    );
  };

  return (
    <PlannedPriceTargetList
      title={t('form.section.take-profits')}
      removeLabel={t('form.action.remove-take-profit')}
      indexPrefix="TP"
      indexHeader={t('form.field.take-profit-short')}
      priceHeader={t('form.field.target-price')}
      amountHeader={
        useSizeUnit ? t('form.field.close-size') : t('form.field.close-percent')
      }
      pricePlaceholder={t('form.placeholder.target-price')}
      pricePrecision={pricePrecision}
      amountPrecision={useSizeUnit ? sizePrecision : 0}
      amountMax={useSizeUnit ? undefined : 100}
      rows={takeProfits.map((target, index) => ({
        key: getTakeProfitKey(target),
        price: target.price,
        amount: useSizeUnit ? target.size : target.closePercent,
        amountPlaceholder: useSizeUnit
          ? t('form.placeholder.close-size')
          : t('form.placeholder.close-percent'),
        priceError: errors.takeProfits?.[index]?.price,
        amountError: useSizeUnit
          ? errors.takeProfits?.[index]?.size
          : errors.takeProfits?.[index]?.closePercent,
      }))}
      emptyState={t('form.empty.take-profits')}
      listError={errors.takeProfitsTotal}
      onPriceChange={(index, value) => updateTakeProfit(index, 'price', value)}
      onAmountChange={(index, value) =>
        updateTakeProfit(index, useSizeUnit ? 'size' : 'closePercent', value)
      }
      onAdd={addTakeProfit}
      onRemove={removeTakeProfit}
    />
  );
}

function RiskManagementSection({
  data,
  errors,
  pnlCurrency,
  pnl,
  defaultRiskAmount,
  displayRMultiples,
  visibleRiskGroups,
  title,
  showTitle = true,
  showResultPreview = true,
  onChange,
}: RiskManagementSectionProps) {
  const { formatValue } = useDisplayFormatter();
  const plugin = getPluginInstance();
  const maeMfeInputMode = plugin?.settings.trade.maeMfeInputMode;
  const showPriceFields = maeMfeInputMode === 'price';
  const showDollarFields = maeMfeInputMode !== 'price';
  const isShort =
    data.direction?.toUpperCase() === 'SHORT' ||
    data.direction?.toUpperCase() === 'SELL';
  const takeProfits = data.takeProfits || [];
  const formLayout = resolveTradeFormLayoutSettings(
    plugin?.settings.trade.tradeFormLayout
  );
  const takeProfitUnit = formLayout.takeProfitUnit;
  const showTakeProfits = !data.isMissedTrade && !data.isBacktestTrade;
  const effectiveRiskAmount = resolveEffectiveRiskAmount(
    data,
    defaultRiskAmount
  );
  const resultRMultiple =
    data.useDirectPnLInput &&
    typeof data.directPnL === 'number' &&
    effectiveRiskAmount &&
    effectiveRiskAmount > 0
      ? pnl / effectiveRiskAmount
      : undefined;

  const renderRiskField = (fieldId: RiskFieldId) => {
    switch (fieldId) {
      case 'stopLoss':
        return (
          <StopLossesSection
            key={fieldId}
            data={data}
            errors={errors}
            pricePrecision={getPricePrecision(data.assetType)}
            sizePrecision={getSizePrecision(data.assetType)}
            unit={formLayout.stopLossUnit}
            onChange={onChange}
          />
        );
      case 'riskAmount':
        return (
          <div className="field" key={fieldId}>
            <NumberInput
              label={t('form.field.risk-amount')}
              value={data.riskAmount}
              onChange={(value) => onChange('riskAmount', value)}
              error={errors.riskAmount}
              precision={2}
              allowDecimal={true}
              placeholder={t('form.placeholder.risk-amount')}
            />
            {canCalculateStopLossRiskAmount(data) &&
              (() => {
                const calculatedRisk = calculateStopLossRiskAmount(data);
                const riskBudgetAmount =
                  typeof data.riskAmount === 'number' && data.riskAmount > 0
                    ? data.riskAmount
                    : defaultRiskAmount > 0
                      ? defaultRiskAmount
                      : undefined;
                const calculatedRiskRMultiple =
                  riskBudgetAmount && riskBudgetAmount > 0
                    ? calculatedRisk / riskBudgetAmount
                    : undefined;

                return (
                  <span className="calculated-risk-hint">
                    {t('form.calculated')}:{' '}
                    {formatPnL(
                      calculatedRisk,
                      true,
                      pnlCurrency,
                      displayRMultiples,
                      calculatedRiskRMultiple
                    )}
                  </span>
                );
              })()}
          </div>
        );
      case 'takeProfits':
        return showTakeProfits ? (
          <TakeProfitsSection
            key={fieldId}
            takeProfits={takeProfits}
            errors={errors}
            pricePrecision={getPricePrecision(data.assetType)}
            sizePrecision={getSizePrecision(data.assetType)}
            takeProfitUnit={takeProfitUnit}
            positionSize={data.positionSize}
            onChange={onChange}
          />
        ) : null;
      case 'mae':
        if (showPriceFields) {
          return (
            <div className="field" key={fieldId}>
              <NumberInput
                label={isShort ? 'MAE Price (High)' : 'MAE Price (Low)'}
                value={data.maePrice}
                onChange={(value) => onChange('maePrice', value)}
                error={errors.maePrice}
                precision={data.assetType === 'forex' ? 5 : 2}
                allowDecimal={true}
                placeholder={
                  isShort ? 'Highest price reached' : 'Lowest price reached'
                }
              />
              {data.maePrice !== undefined &&
                data.entryPrice &&
                data.positionSize &&
                data.positionSize > 0 && (
                  <span className="calculated-risk-hint">
                    ={' '}
                    {formatValue({
                      kind: 'money',
                      value: calculateAssetAdjustedPriceMoveValue(
                        data,
                        isShort
                          ? data.entryPrice - data.maePrice
                          : data.maePrice - data.entryPrice,
                        data.positionSize
                      ),
                      currencyCode: pnlCurrency,
                      notation: 'compact',
                      showCents: true,
                    })}
                  </span>
                )}
            </div>
          );
        }

        if (showDollarFields) {
          return (
            <div className="field" key={fieldId}>
              <NumberInput
                label={t('tradelog.column.mae-with-currency', {
                  currency: pnlCurrency,
                })}
                value={data.mae}
                onChange={(value) => onChange('mae', value)}
                error={errors.mae}
                precision={2}
                allowDecimal={true}
                placeholder={t('form.field.mae-placeholder-currency', {
                  currency: pnlCurrency,
                })}
              />
            </div>
          );
        }
        return null;
      case 'mfe':
        if (showPriceFields) {
          return (
            <div className="field" key={fieldId}>
              <NumberInput
                label={isShort ? 'MFE Price (Low)' : 'MFE Price (High)'}
                value={data.mfePrice}
                onChange={(value) => onChange('mfePrice', value)}
                error={errors.mfePrice}
                precision={data.assetType === 'forex' ? 5 : 2}
                allowDecimal={true}
                placeholder={
                  isShort ? 'Lowest price reached' : 'Highest price reached'
                }
              />
              {data.mfePrice !== undefined &&
                data.entryPrice &&
                data.positionSize &&
                data.positionSize > 0 && (
                  <span className="calculated-risk-hint">
                    ={' '}
                    {formatValue({
                      kind: 'money',
                      value: calculateAssetAdjustedPriceMoveValue(
                        data,
                        isShort
                          ? data.entryPrice - data.mfePrice
                          : data.mfePrice - data.entryPrice,
                        data.positionSize
                      ),
                      currencyCode: pnlCurrency,
                      notation: 'compact',
                      showCents: true,
                    })}
                  </span>
                )}
            </div>
          );
        }

        if (showDollarFields) {
          return (
            <div className="field" key={fieldId}>
              <NumberInput
                label={t('tradelog.column.mfe-with-currency', {
                  currency: pnlCurrency,
                })}
                value={data.mfe}
                onChange={(value) => onChange('mfe', value)}
                error={errors.mfe}
                precision={2}
                allowDecimal={true}
                placeholder={t('form.field.mfe-placeholder-currency', {
                  currency: pnlCurrency,
                })}
              />
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  const orderedRiskFieldElements = visibleRiskGroups.reduce<React.ReactNode[]>(
    (elements, groupId) => {
      if (groupId === 'riskPlanning') {
        
        
        elements.push(renderRiskField('riskAmount'));
        elements.push(renderRiskField('stopLoss'));
      } else if (groupId === 'takeProfits') {
        elements.push(renderRiskField('takeProfits'));
      } else if (groupId === 'maeMfe') {
        elements.push(renderRiskField('mae'));
        elements.push(renderRiskField('mfe'));
      }
      return elements;
    },
    []
  );

  return (
    <div className="risk-management-section">
      {showTitle && (
        <h4 className="section-title">
          {title ?? t('form.section.risk-management')}
        </h4>
      )}
      <div className="risk-fields">
        {orderedRiskFieldElements}
        {showResultPreview && resultRMultiple !== undefined && (
          <div className="risk-result-preview">
            <span className="risk-result-preview__label">
              {t('form.layout.result-r')}
            </span>
            <span className="risk-result-preview__value">
              <RMultipleValue
                value={resultRMultiple}
                precision={2}
                signed={false}
                tone="none"
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


const EXCHANGE_FIELDS_BY_ASSET_TYPE = new Map<
  string,
  React.ComponentType<EntryExitSectionProps>
>([
  ['stock', StockFields],
  ['crypto', CryptoFields],
]);


const STRUCTURAL_FIELDS_BY_ASSET_TYPE = new Map<
  string,
  React.ComponentType<EntryExitSectionProps & { showManualFxRate: boolean }>
>([
  ['options', OptionsFields],
  ['futures', FuturesFields],
  ['forex', ForexFields],
  ['cfd', CFDFields],
]);


function AssetSpecificFields({
  data,
  errors,
  onChange,
  showManualFxRate,
  showExchange,
  showStructuralFields,
}: EntryExitSectionProps & {
  showManualFxRate: boolean;
  showExchange: boolean;
  showStructuralFields: boolean;
}) {
  if (!data.assetType) return null;

  
  
  
  
  
  const ExchangeFields = showExchange
    ? EXCHANGE_FIELDS_BY_ASSET_TYPE.get(data.assetType)
    : undefined;
  const StructuralFields = showStructuralFields
    ? STRUCTURAL_FIELDS_BY_ASSET_TYPE.get(data.assetType)
    : undefined;

  if (!ExchangeFields && !StructuralFields) return null;

  return (
    <div className="asset-specific-fields">
      {ExchangeFields && (
        <ExchangeFields data={data} errors={errors} onChange={onChange} />
      )}
      {StructuralFields && (
        <StructuralFields
          data={data}
          errors={errors}
          onChange={onChange}
          showManualFxRate={showManualFxRate}
        />
      )}
    </div>
  );
}

interface EntryExitSectionProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

function DirectionField({ data, errors, onChange }: EntryExitSectionProps) {
  if (data.assetType === 'options') return null;

  return (
    <div className="field">
      <div className="label" id="direction-label">
        {t('form.field.direction')}
        <span className="required-indicator">*</span>
      </div>
      <div
        className="direction-container"
        role="radiogroup"
        aria-labelledby="direction-label"
        aria-required="true"
      >
        <button
          type="button"
          className="direction-button"
          onClick={() => onChange('direction', 'long')}
          aria-checked={data.direction === 'long'}
          role="radio"
        >
          {t('form.field.direction.long')}
        </button>
        <button
          type="button"
          className="direction-button"
          onClick={() => onChange('direction', 'short')}
          aria-checked={data.direction === 'short'}
          role="radio"
        >
          {t('form.field.direction.short')}
        </button>
      </div>
      {errors.direction && (
        <div className="errorMessage" role="alert">
          {errors.direction}
        </div>
      )}
    </div>
  );
}

const assetTypeOptionKeys = [
  { type: 'stock', labelKey: 'form.field.asset-type.stock' },
  { type: 'options', labelKey: 'form.field.asset-type.options' },
  { type: 'futures', labelKey: 'form.field.asset-type.futures' },
  { type: 'forex', labelKey: 'form.field.asset-type.forex' },
  { type: 'crypto', labelKey: 'form.field.asset-type.crypto' },
  { type: 'cfd', labelKey: 'form.field.asset-type.cfd' },
] as const;

const getAssetTypeOptions = () =>
  assetTypeOptionKeys.map(({ type, labelKey }) => ({
    type,
    label: t(labelKey),
  }));

function AssetTypeField({ data, errors, onChange }: EntryExitSectionProps) {
  return (
    <div className="field">
      <div className="label" id="assetType-label">
        {t('form.field.asset-type')}
        <span className="required-indicator">*</span>
      </div>
      <div
        className="asset-type-container"
        role="radiogroup"
        aria-labelledby="assetType-label"
        aria-required="true"
      >
        {getAssetTypeOptions().map(({ type, label }) => (
          <button
            key={type}
            type="button"
            className="asset-type-button"
            onClick={() => onChange('assetType', type)}
            aria-checked={data.assetType === type}
            role="radio"
          >
            {label}
          </button>
        ))}
      </div>
      {errors.assetType && (
        <div className="errorMessage" role="alert">
          {errors.assetType}
        </div>
      )}
    </div>
  );
}

function shouldClearAutoDerivedCfdCurrencyOnAssetTypeChange({
  currentAssetType,
  nextAssetType,
  currency,
  fxRate,
  instrumentCurrency,
  hasExplicitCurrencySelection,
}: {
  currentAssetType: string | undefined;
  nextAssetType: string;
  currency: string | undefined;
  fxRate: number | undefined;
  instrumentCurrency: string | undefined;
  hasExplicitCurrencySelection: boolean;
}): boolean {
  return (
    currentAssetType === 'cfd' &&
    nextAssetType !== 'cfd' &&
    currency !== undefined &&
    currency === instrumentCurrency &&
    fxRate === undefined &&
    !hasExplicitCurrencySelection
  );
}

function shouldClearInvalidInstrumentOnAssetTypeChange({
  isValid,
  previousAssetType,
  currentAssetType,
}: {
  isValid: boolean;
  previousAssetType: string | undefined;
  currentAssetType: string | undefined;
}): boolean {
  return !isValid && previousAssetType !== currentAssetType;
}

function useAssetTypeChangeHandler({
  data,
  onChange,
  hasExplicitCurrencySelectionRef,
}: Pick<AssetFieldsProps, 'data' | 'onChange'> & {
  hasExplicitCurrencySelectionRef: React.RefObject<boolean>;
}) {
  return useCallback(
    (nextAssetType: string) => {
      const instrumentCurrency = data.instrument
        ? getPluginInstance()?.optionsService?.getInstrument(
            data.instrument,
            'cfd'
          )?.currency
        : undefined;
      if (
        shouldClearAutoDerivedCfdCurrencyOnAssetTypeChange({
          currentAssetType: data.assetType,
          nextAssetType,
          currency: data.currency,
          fxRate: data.fxRate,
          instrumentCurrency,
          hasExplicitCurrencySelection: hasExplicitCurrencySelectionRef.current,
        })
      ) {
        
        onChange('currency', undefined);
      }
      onChange('assetType', nextAssetType);
    },
    [
      data.assetType,
      data.currency,
      data.fxRate,
      data.instrument,
      hasExplicitCurrencySelectionRef,
      onChange,
    ]
  );
}

function useAssetFieldsModel({
  data,
  onChange,
  onAccountRequirementChange,
  preserveManualTradeCurrency,
}: Pick<
  AssetFieldsProps,
  'data' | 'onChange' | 'onAccountRequirementChange'
> & {
  preserveManualTradeCurrency: boolean;
}) {
  const { currency: globalCurrency } = useCurrency();
  const previousAssetTypeRef = useRef<string | undefined>(data.assetType);
  const previousInstrumentRef = useRef<string | undefined>(data.instrument);
  const previousCurrencyInstrumentRef = useRef<string | undefined>(
    data.instrument
  );
  const previousCurrencyAssetTypeRef = useRef<string | undefined>(
    data.assetType
  );
  const previousCfdInstrumentRef = useRef<string | undefined>(
    data.assetType === 'cfd' ? data.instrument : undefined
  );
  const hasExplicitCurrencySelectionRef = useRef(false);
  const currentCfdContractSizeRef = useRef<number | undefined>(
    typeof data.contractSize === 'number' ? data.contractSize : undefined
  );
  const pendingCreatedAccountNameRef = useRef<string | null>(null);
  const selectedAccountsRef = useRef<string[]>(
    Array.isArray(data.account) ? data.account : []
  );
  
  
  
  
  
  const [accountOptions, setAccountOptions] = useState<string[]>([]);

  const [instrumentOptions, setInstrumentOptions] = useState<string[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(true);
  const pnlCurrency = data.currency || globalCurrency;
  const tradeCurrencyOptions = useMemo(
    () => [
      { value: '__NONE__', label: t('common.none') },
      ...getCurrencyOptions(),
    ],
    []
  );
  const requiresAccount = !data.isMissedTrade && !data.isBacktestTrade;
  const hasSelectedAccount =
    Array.isArray(data.account) && data.account.length > 0;
  const isAccountCreationBlocked =
    requiresAccount &&
    !hasSelectedAccount &&
    !isLoadingAccounts &&
    accountOptions.length === 0;

  useEffect(() => {
    selectedAccountsRef.current = Array.isArray(data.account)
      ? data.account
      : [];
  }, [data.account]);

  
  const loadAccountOptions = useCallback(async () => {
    try {
      setIsLoadingAccounts(true);

      const plugin = getPluginInstance();
      const accountPageService = plugin?.accountPageService;
      const tradeService = plugin?.tradeService;
      if (!accountPageService && !tradeService) {
        console.warn(
          'Account services not available, skipping account loading'
        );
        setIsLoadingAccounts(false);
        return;
      }

      const catalogAccounts = accountPageService
        ? await accountPageService.getAccountCatalog()
        : [];
      const uniqueAccounts = tradeService
        ? await tradeService.getUniqueAccounts()
        : [];
      const allAccountNames = mergeActiveTradeFormAccountNames(
        catalogAccounts,
        uniqueAccounts
      );
      const selectableAccountNames = filterActiveCopyAccounts(
        allAccountNames,
        plugin?.settings.account?.accountMetadata,
        data.entryTime
      );

      setAccountOptions(selectableAccountNames);

      const pendingCreatedAccountName = pendingCreatedAccountNameRef.current;
      const selectedAccounts = selectedAccountsRef.current;
      if (
        pendingCreatedAccountName &&
        selectableAccountNames.includes(pendingCreatedAccountName) &&
        selectedAccounts.length === 0
      ) {
        onChange('account', [pendingCreatedAccountName]);
        pendingCreatedAccountNameRef.current = null;
      }
    } catch (error) {
      console.error('Failed to load options:', error);
      setAccountOptions([]);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [data.entryTime, onChange]);

  
  useEffect(() => {
    
    void loadAccountOptions();

    const optionsService = getPluginInstance()?.optionsService;

    
    const customInstruments =
      data.assetType && optionsService
        ? optionsService.getInstrumentsForAssetType(data.assetType)
        : [];

    
    
    const instrumentOptions =
      data.instrument &&
      data.assetType &&
      !customInstruments.includes(data.instrument)
        ? [...customInstruments, data.instrument]
        : [...customInstruments];

    setInstrumentOptions(instrumentOptions);
  }, [data.assetType, data.instrument, loadAccountOptions]); 

  
  useEventBus('account:changed', (payload) => {
    if (payload.action === 'created') {
      pendingCreatedAccountNameRef.current =
        payload.accountName || payload.accountId || null;
    }

    void loadAccountOptions();
  });

  useEffect(() => {
    onAccountRequirementChange?.(isAccountCreationBlocked);
  }, [isAccountCreationBlocked, onAccountRequirementChange]);

  
  const updateInstrumentOptions = useCallback(() => {
    try {
      const optionsService = getPluginInstance()?.optionsService;

      const freshInstruments =
        data.assetType && optionsService
          ? optionsService.getInstrumentsForAssetType(data.assetType)
          : [];

      
      
      const instrumentOptions =
        data.instrument &&
        data.assetType &&
        !freshInstruments.includes(data.instrument)
          ? [...freshInstruments, data.instrument]
          : [...freshInstruments];

      setInstrumentOptions(instrumentOptions);
    } catch (error) {
      console.error('Error updating instrument options:', error);
    }
  }, [data.assetType, data.instrument]);

  
  const debouncedUpdateInstruments = useMemo(
    () => debounce(updateInstrumentOptions, 300),
    [updateInstrumentOptions]
  );

  
  useEffect(() => {
    return () => {
      debouncedUpdateInstruments.cancel();
    };
  }, [debouncedUpdateInstruments]);

  
  useEventBus('options:changed', debouncedUpdateInstruments);

  
  const handleSaveInstrument = async (option: string) => {
    if (!/^[A-Z0-9.]+$/i.test(option)) return;

    try {
      
      const plugin = getPluginInstance();
      const optionsService = plugin?.optionsService;
      if (!optionsService) {
        console.error('Cannot add instrument: options service not available');
        return;
      }

      
      if (!data.assetType) {
        console.error('Cannot add instrument: No asset type selected');
        new Notice(t('notice.error.asset-type-required'));
        return;
      }

      const added = await optionsService.addOption(
        OptionType.INSTRUMENT,
        option,
        data.assetType, 
        undefined,
        undefined,
        undefined,
        data.assetType === 'cfd' ? data.currency : undefined
      );

      if (added) {
        
        optionsService.notifyOptionsChanged();
      }
    } catch (error) {
      console.error('Failed to save custom instrument option:', error);
    }
  };

  useEffect(() => {
    if (data.assetType === 'cfd') {
      currentCfdContractSizeRef.current =
        typeof data.contractSize === 'number' ? data.contractSize : undefined;
    }
  }, [data.contractSize, data.assetType]);

  useForexPnlConversionRate({ data, globalCurrency, onChange });

  useEffect(() => {
    if (!data.instrument || !data.assetType) {
      if (
        data.assetType !== 'cfd' &&
        previousCurrencyAssetTypeRef.current === 'cfd' &&
        data.currency !== undefined &&
        !preserveManualTradeCurrency
      ) {
        onChange('currency', undefined);
      }

      previousCurrencyInstrumentRef.current = data.instrument;
      previousCurrencyAssetTypeRef.current = data.assetType;
      return;
    }

    const optionsService = getPluginInstance()?.optionsService;
    if (!optionsService) return;

    const selectedInstrument = optionsService.getInstrument(
      data.instrument,
      data.assetType
    );
    const instrumentChanged =
      previousCurrencyInstrumentRef.current !== data.instrument ||
      previousCurrencyAssetTypeRef.current !== data.assetType;

    if (instrumentChanged) {
      hasExplicitCurrencySelectionRef.current = false;
    }

    if (data.assetType === 'cfd' && selectedInstrument?.currency) {
      if (
        instrumentChanged &&
        !hasExplicitCurrencySelectionRef.current &&
        data.currency !== selectedInstrument.currency
      ) {
        onChange('currency', selectedInstrument.currency);
      }
    } else if (
      data.assetType !== 'cfd' &&
      previousCurrencyAssetTypeRef.current === 'cfd' &&
      data.currency !== undefined &&
      !preserveManualTradeCurrency
    ) {
      onChange('currency', undefined);
    } else if (
      data.assetType === 'cfd' &&
      instrumentChanged &&
      !hasExplicitCurrencySelectionRef.current &&
      data.currency !== undefined
    ) {
      onChange('currency', undefined);
    }

    previousCurrencyInstrumentRef.current = data.instrument;
    previousCurrencyAssetTypeRef.current = data.assetType;
  }, [
    data.instrument,
    data.assetType,
    data.currency,
    data.filePath,
    onChange,
    preserveManualTradeCurrency,
  ]);

  
  useEffect(() => {
    if (!data.instrument || !data.assetType) {
      previousInstrumentRef.current = data.instrument;
      return;
    }

    
    const plugin = getPluginInstance();
    const optionsService = plugin?.optionsService;
    const specService = plugin?.specService;

    if (!optionsService) return;

    
    const isValid = optionsService.isInstrumentValidForAssetType(
      data.instrument,
      data.assetType
    );

    
    
    
    if (!isValid) {
      previousInstrumentRef.current = data.instrument;
      if (
        shouldClearInvalidInstrumentOnAssetTypeChange({
          isValid,
          previousAssetType: previousAssetTypeRef.current,
          currentAssetType: data.assetType,
        })
      ) {
        onChange('instrument', '');
      }
      return;
    }

    previousInstrumentRef.current = data.instrument;

    const instrument = data.instrument;
    const contractDefaults = (assetType: string) =>
      resolveInstrumentContractDefaults(instrument, assetType, {
        specs: specService,
        catalog: optionsService,
      });

    if (data.assetType === 'futures') {
      const defaults = contractDefaults('futures');
      onChange('dollarPerPoint', defaults.dollarPerPoint);
      onChange('tickSize', defaults.tickSize);
      onChange('tickValue', defaults.tickValue);
    }

    if (data.assetType === 'forex') {
      const defaults = contractDefaults('forex');
      onChange('pipValue', defaults.pipValue);
      onChange('pipSize', defaults.pipSize);
      onChange('lotSize', defaults.lotSize);
    }

    
    if (data.assetType === 'cfd') {
      const previousInstrument = previousCfdInstrumentRef.current;
      const previousAssetType = previousAssetTypeRef.current;
      const isSameInstrument = previousInstrument === data.instrument;
      const existingContractSize = currentCfdContractSizeRef.current;
      const hasExistingTradeContractSize =
        Boolean(data.filePath) &&
        typeof existingContractSize === 'number' &&
        Number.isFinite(existingContractSize) &&
        existingContractSize > 0;

      previousCfdInstrumentRef.current = data.instrument;

      
      
      
      if (
        hasExistingTradeContractSize &&
        isSameInstrument &&
        previousAssetType === 'cfd'
      ) {
        return;
      }

      onChange('contractSize', contractDefaults('cfd').contractSize);
    }
  }, [data.instrument, data.assetType, data.filePath, onChange]);

  
  useEffect(() => {
    const previousAssetType = previousAssetTypeRef.current;
    const assetTypeChanged = previousAssetType !== data.assetType;

    
    if (data.assetType !== 'forex') {
      if (data.pipValue !== undefined) onChange('pipValue', undefined);
      if (data.pipSize !== undefined) onChange('pipSize', undefined);
      if (data.lotSize !== undefined) onChange('lotSize', undefined);
    }

    
    if (data.assetType !== 'futures') {
      if (data.dollarPerPoint !== undefined)
        onChange('dollarPerPoint', undefined);
      if (data.tickSize !== undefined) onChange('tickSize', undefined);
      if (data.tickValue !== undefined) onChange('tickValue', undefined);
    }

    if (assetTypeChanged) {
      if (data.assetType === 'options') {
        if (data.contractSize !== DEFAULT_OPTION_CONTRACT_SIZE) {
          onChange('contractSize', DEFAULT_OPTION_CONTRACT_SIZE);
        }
      } else if (data.assetType === 'cfd') {
        // intentional
      } else if (data.contractSize !== undefined) {
        onChange('contractSize', undefined);
      }
    }

    previousAssetTypeRef.current = data.assetType;
  }, [
    data.assetType,
    data.contractSize,
    data.pipValue,
    data.pipSize,
    data.lotSize,
    data.dollarPerPoint,
    data.tickSize,
    data.tickValue,
    onChange,
  ]);

  
  useEffect(() => {
    if (data.assetType !== 'futures' || !data.instrument) return;

    
    if (data.dollarPerPoint === undefined) return;

    
    const optionsService = getPluginInstance()?.optionsService;
    if (!optionsService) return;

    const instrument = data.instrument;

    
    const saveTimeout = window.setTimeout(() => {
      void (async () => {
        try {
          await optionsService.setFuturesDataForInstrument(instrument, {
            dollarPerPoint: data.dollarPerPoint,
            tickSize: data.tickSize,
            tickValue: data.tickValue,
          });
        } catch (error) {
          console.error('Failed to save futures data for instrument:', error);
        }
      })();
    }, 1000);

    
    return () => window.clearTimeout(saveTimeout);
  }, [
    data.assetType,
    data.instrument,
    data.dollarPerPoint,
    data.tickSize,
    data.tickValue,
  ]);

  useEffect(() => {
    if (data.assetType !== 'cfd' || !data.instrument) return;

    
    
    if (data.filePath) return;

    if (data.contractSize === undefined) return;

    const optionsService = getPluginInstance()?.optionsService;
    if (!optionsService) return;

    const instrument = data.instrument;

    const saveTimeout = window.setTimeout(() => {
      void (async () => {
        try {
          await optionsService.setCfdDataForInstrument(instrument, {
            contractSize: data.contractSize,
          });
        } catch (error) {
          console.error('Failed to save CFD data for instrument:', error);
        }
      })();
    }, 1000);

    return () => window.clearTimeout(saveTimeout);
  }, [data.assetType, data.instrument, data.contractSize, data.filePath]);

  
  
  const pnl = calculatePnL(data);

  
  const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange]);

  
  useEffect(() => {}, []);

  
  const plugin = getPluginInstance();
  const displayRMultiples = plugin?.settings.trade.displayRMultiples ?? false;
  const defaultRiskAmount = plugin?.settings.trade.defaultRiskAmount ?? 0;

  
  const shouldDisplaySwap =
    data.assetType === 'forex' || data.assetType === 'cfd';

  
  const getInstrumentLabel = (): string => {
    switch (data.assetType) {
      case 'stock':
        return t('form.field.instrument.ticker');
      case 'options':
        return t('form.field.instrument.option-symbol');
      case 'futures':
        return t('form.field.instrument.future-symbol');
      case 'forex':
        return t('form.field.instrument.forex-pair');
      case 'crypto':
        return t('form.field.instrument.crypto-symbol');
      case 'cfd':
        return t('form.field.instrument.cfd-symbol');
      default:
        return t('form.field.instrument.ticker');
    }
  };

  const handleCreateAccount = useCallback(
    (initialName?: string) => {
      const plugin = getPluginInstance();
      if (!plugin) {
        console.error(
          'Failed to open create account modal: plugin unavailable'
        );
        return;
      }

      openCreateAccountModal(
        plugin.app,
        plugin,
        () => {
          void loadAccountOptions();
        },
        {
          navigateOnSave: false,
          initialName,
        }
      );
    },
    [loadAccountOptions]
  );

  return {
    pnlCurrency,
    tradeCurrencyOptions,
    isAccountCreationBlocked,
    accountOptions,
    instrumentOptions,
    isLoadingAccounts,
    pnl,
    debouncedOnChange,
    displayRMultiples,
    defaultRiskAmount,
    shouldDisplaySwap,
    getInstrumentLabel,
    handleCreateAccount,
    handleSaveInstrument,
    hasExplicitCurrencySelectionRef,
    globalCurrency,
  };
}

interface BasicLayoutVisibilityState {
  layoutVisibleBasicOptionalItems: TradeFormLayoutItemId[];
  visibleRiskGroups: TradeFormLayoutItemId[];
  visibleCostGroups: TradeFormLayoutItemId[];
  showTradingCosts: boolean;
  showAssetSpecificFields: boolean;
  showExchangeField: boolean;
}

function resolveBasicLayoutVisibility({
  layout,
  data,
  errors,
  isEditMode,
}: {
  layout: TradeFormLayoutSettings;
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  isEditMode: boolean;
}): BasicLayoutVisibilityState {
  const visibleCostGroups = (
    [
      'tradingCosts',
      'tradingCostRebate',
      'tradingCostSwap',
      'tradingCostFees',
    ] satisfies TradeFormLayoutItemId[]
  ).filter(
    (itemId) =>
      isTradeFormLayoutItemVisible(layout, itemId) ||
      (isEditMode && hasPopulatedTradeFormLayoutItem(data, itemId))
  );

  return {
    layoutVisibleBasicOptionalItems:
      getEditAwareVisibleOrderedTradeFormLayoutItems(
        layout,
        TRADE_FORM_BASIC_OPTIONAL_ITEM_IDS,
        data,
        isEditMode
      ),
    visibleRiskGroups: (
      [
        'riskPlanning',
        'takeProfits',
        'maeMfe',
      ] satisfies TradeFormLayoutItemId[]
    ).filter(
      (itemId) =>
        isTradeFormLayoutItemVisible(layout, itemId) ||
        (isEditMode && hasPopulatedTradeFormLayoutItem(data, itemId)) ||
        (itemId === 'riskPlanning' &&
          Boolean(
            errors.stopLosses || errors.stopLossesTotal || errors.riskAmount
          )) ||
        (itemId === 'takeProfits' &&
          Boolean(errors.takeProfits || errors.takeProfitsTotal)) ||
        (itemId === 'maeMfe' &&
          Boolean(
            errors.mae || errors.maePrice || errors.mfe || errors.mfePrice
          ))
    ),
    visibleCostGroups,
    showTradingCosts:
      shouldShowTradingCostsSection(layout, errors) ||
      (isEditMode && visibleCostGroups.length > 0),
    showAssetSpecificFields:
      isTradeFormLayoutItemVisible(layout, 'assetSpecific') ||
      (isEditMode && hasPopulatedTradeFormLayoutItem(data, 'assetSpecific')) ||
      hasAssetSpecificValidationErrors(errors),
    showExchangeField:
      isTradeFormLayoutItemVisible(layout, 'exchange') ||
      (isEditMode && hasPopulatedTradeFormLayoutItem(data, 'exchange')),
  };
}

interface LayoutItemContext {
  layout: TradeFormLayoutSettings;
  data: Partial<TradeFormData>;
  isEditMode: boolean;
}


const isLayoutItemShown = (
  { layout, data, isEditMode }: LayoutItemContext,
  itemId: TradeFormLayoutItemId
): boolean =>
  isTradeFormLayoutItemVisible(layout, itemId) ||
  (isEditMode && hasPopulatedTradeFormLayoutItem(data, itemId));


const errorVisibleBasicItemsOf = (
  errors: TradeFormErrors
): Set<TradeFormLayoutItemId> => {
  const items = new Set<TradeFormLayoutItemId>();
  const errorItems: Array<[TradeFormLayoutItemId, boolean]> = [
    [
      'tradingCosts',
      Boolean(
        errors.commission ||
        errors.commissionType ||
        errors.rebate ||
        errors.swap ||
        errors.fees
      ),
    ],
    [
      'riskPlanning',
      Boolean(errors.stopLosses || errors.stopLossesTotal || errors.riskAmount),
    ],
    ['takeProfits', Boolean(errors.takeProfits || errors.takeProfitsTotal)],
    [
      'maeMfe',
      Boolean(errors.mae || errors.maePrice || errors.mfe || errors.mfePrice),
    ],
    ['tradeCurrency', Boolean(errors.fxRate)],
  ];
  for (const [itemId, hasError] of errorItems) {
    if (hasError) items.add(itemId);
  }
  return items;
};

const withErrorVisibleItems = (
  layoutItems: readonly TradeFormLayoutItemId[],
  errorItems: ReadonlySet<TradeFormLayoutItemId>
) => {
  const visibleBasicOptionalItems = [...layoutItems];
  const visibleBasicOptionalItemSet = new Set(visibleBasicOptionalItems);
  for (const itemId of TRADE_FORM_BASIC_OPTIONAL_ITEM_IDS) {
    if (errorItems.has(itemId) && !visibleBasicOptionalItemSet.has(itemId)) {
      visibleBasicOptionalItems.push(itemId);
      visibleBasicOptionalItemSet.add(itemId);
    }
  }
  return { visibleBasicOptionalItems, visibleBasicOptionalItemSet };
};

const resolveEntryExitVisibility = ({
  layout,
  data,
  errors,
  isEditMode,
}: LayoutItemContext & { errors: TradeFormErrors }) => {
  const context = { layout, data, isEditMode };
  return {
    idealExits: isLayoutItemShown(context, 'idealExits'),
    
    
    
    unrealizedSnapshot:
      !areSnapshotKeysClaimedByCustomFields(
        getPluginInstance()?.customFieldsService?.getFields()
      ) && isLayoutItemShown(context, 'unrealizedSnapshot'),
    dividends: isLayoutItemShown(context, 'dividends'),
    directPnlToggle: shouldShowDirectPnlToggle({
      isLayoutVisible: isTradeFormLayoutItemVisible(layout, 'directPnlToggle'),
      isEditMode,
      data,
      hasDirectPnlError: Boolean(errors.directPnL),
    }),
  };
};


const showsAssetTypeSelector = (
  layout: TradeFormLayoutSettings,
  data: Partial<TradeFormData>
): boolean =>
  layout.assetTypeMode !== 'fixed' ||
  layout.defaultAssetType === undefined ||
  data.assetType !== layout.defaultAssetType;

const isOpenTradeFormData = (data: Partial<TradeFormData>): boolean =>
  hasOpenTradeEvidence(data) &&
  isTradeOpenWithContext({
    tradeStatus: data.tradeStatus,
    exitTime: data.exitTime,
    exitPrice: data.exitPrice,
    pnl: data._originalPnlWasNull ? null : data.pnl,
    useDirectPnLInput: data.useDirectPnLInput,
    exits: data.exits,
    entries: data.entries,
  });

function AccountField({
  data,
  errors,
  accountOptions,
  isLoadingAccounts,
  isAccountCreationBlocked,
  onChange,
  onCreateAccount,
}: {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  accountOptions: string[];
  isLoadingAccounts: boolean;
  isAccountCreationBlocked: boolean;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  onCreateAccount: (name?: string) => void;
}) {
  return (
    <div className="field">
      {isLoadingAccounts ? (
        <div className="asset-loading-accounts">
          <div className="asset-account-label">{t('form.field.account')}</div>
          {t('common.loading')}
        </div>
      ) : (
        <AccountSelectField
          data={data}
          errors={errors}
          accountOptions={accountOptions}
          onChange={onChange}
          onRequestCreateAccount={onCreateAccount}
        />
      )}
      <PropChallengePhaseHint data={data} />
      {isAccountCreationBlocked && (
        <AccountEmptyState onCreateAccount={onCreateAccount} />
      )}
    </div>
  );
}

const NO_CURRENCY_OPTION = '__NONE__';


function TradeCurrencyField({
  data,
  errors,
  showTradeCurrency,
  globalCurrency,
  tradeCurrencyOptions,
  showManualFxRate,
  onCurrencyChange,
  onChange,
}: Omit<TradeCurrencySectionProps, 'onTradeCurrencyChange'> & {
  showTradeCurrency: boolean;
  onCurrencyChange: (value: string | undefined) => void;
}) {
  if (showTradeCurrency) {
    return (
      <TradeCurrencySection
        data={data}
        errors={errors}
        globalCurrency={globalCurrency}
        tradeCurrencyOptions={tradeCurrencyOptions}
        showManualFxRate={showManualFxRate}
        onTradeCurrencyChange={onCurrencyChange}
        onChange={onChange}
      />
    );
  }
  if (data.assetType !== 'cfd') return null;
  return (
    <div className="field">
      <Select
        label={t('settings.general.currency')}
        value={data.currency || NO_CURRENCY_OPTION}
        onChange={(value) =>
          onCurrencyChange(value === NO_CURRENCY_OPTION ? undefined : value)
        }
        options={tradeCurrencyOptions}
        id="trade-currency-select"
      />
    </div>
  );
}

const AssetFieldsComponent: React.FC<AssetFieldsProps> = ({
  data,
  errors,
  onChange,
  instruments: _instruments = EMPTY_INSTRUMENTS,
  onAccountRequirementChange,
  layout,
  forcePriceInputMode = false,
  isEditMode,
}) => {
  const preserveManualTradeCurrency = isLayoutItemShown(
    { layout, data, isEditMode },
    'tradeCurrency'
  );
  const {
    pnlCurrency,
    tradeCurrencyOptions,
    isAccountCreationBlocked,
    accountOptions,
    instrumentOptions,
    isLoadingAccounts,
    pnl,
    debouncedOnChange,
    displayRMultiples,
    defaultRiskAmount,
    shouldDisplaySwap,
    getInstrumentLabel,
    handleCreateAccount,
    handleSaveInstrument,
    hasExplicitCurrencySelectionRef,
    globalCurrency,
  } = useAssetFieldsModel({
    data,
    onChange,
    onAccountRequirementChange,
    preserveManualTradeCurrency,
  });
  const handleAssetTypeChange = useAssetTypeChangeHandler({
    data,
    onChange,
    hasExplicitCurrencySelectionRef,
  });

  const {
    layoutVisibleBasicOptionalItems,
    visibleRiskGroups,
    visibleCostGroups,
    showTradingCosts,
    showAssetSpecificFields,
    showExchangeField,
  } = resolveBasicLayoutVisibility({ layout, data, errors, isEditMode });
  const { visibleBasicOptionalItems, visibleBasicOptionalItemSet } =
    withErrorVisibleItems(
      layoutVisibleBasicOptionalItems,
      errorVisibleBasicItemsOf(errors)
    );
  const entryExitVisibility = resolveEntryExitVisibility({
    layout,
    data,
    errors,
    isEditMode,
  });
  const effectiveInputMode = resolveEffectiveTradeFormInputMode({
    layoutInputMode: layout.inputMode,
    forcePriceInputMode,
    isOpenTrade: isOpenTradeFormData(data),
    useDirectPnLInput: data.useDirectPnLInput,
  });
  let tradingCostsRendered = false;
  let riskManagementRendered = false;

  const renderOptionalLayoutItem = (itemId: TradeFormLayoutItemId) => {
    switch (itemId) {
      case 'tradingCosts':
      case 'tradingCostRebate':
      case 'tradingCostSwap':
      case 'tradingCostFees':
        if (tradingCostsRendered || !showTradingCosts) {
          return null;
        }
        tradingCostsRendered = true;
        return showTradingCosts ? (
          <TradingCostsSection
            key="tradingCosts"
            data={data}
            errors={errors}
            pnlCurrency={pnlCurrency}
            shouldDisplaySwap={shouldDisplaySwap}
            visibleCostGroups={visibleCostGroups}
            onChange={debouncedOnChange}
          />
        ) : null;
      case 'riskPlanning':
      case 'takeProfits':
      case 'maeMfe': {
        if (riskManagementRendered || visibleRiskGroups.length === 0) {
          return null;
        }
        riskManagementRendered = true;
        return (
          <RiskManagementSection
            key="riskManagement"
            data={data}
            errors={errors}
            pnlCurrency={pnlCurrency}
            pnl={pnl}
            defaultRiskAmount={defaultRiskAmount}
            displayRMultiples={displayRMultiples}
            visibleRiskGroups={visibleRiskGroups}
            onChange={debouncedOnChange}
          />
        );
      }
      case 'tradeCurrency':
        
        return null;
      case 'pnlPreview':
        return null;
      default:
        return null;
    }
  };

  return (
    <FormSection title={t('form.section.trade-details')}>
      <AccountField
        data={data}
        errors={errors}
        accountOptions={accountOptions}
        isLoadingAccounts={isLoadingAccounts}
        isAccountCreationBlocked={isAccountCreationBlocked}
        onChange={onChange}
        onCreateAccount={handleCreateAccount}
      />

      {showsAssetTypeSelector(layout, data) && (
        <AssetTypeField
          data={data}
          errors={errors}
          onChange={(field, value) => {
            if (field === 'assetType' && typeof value === 'string') {
              handleAssetTypeChange(value);
              return;
            }
            onChange(field, value);
          }}
        />
      )}

      <div className="field">
        <ComboBox
          label={getInstrumentLabel()}
          options={instrumentOptions}
          value={data.instrument || ''}
          onChange={(value) => onChange('instrument', value)}
          error={errors.instrument}
          allowCreate={true}
          isMulti={false}
          onSaveOption={handleSaveInstrument}
          required={true}
        />
      </div>

      <TradeCurrencyField
        data={data}
        errors={errors}
        showTradeCurrency={visibleBasicOptionalItemSet.has('tradeCurrency')}
        globalCurrency={globalCurrency}
        tradeCurrencyOptions={tradeCurrencyOptions}
        showManualFxRate={layout.showManualFxRate}
        onCurrencyChange={(value) => {
          hasExplicitCurrencySelectionRef.current = true;
          onChange('currency', value);
        }}
        onChange={onChange}
      />

      
      {(showAssetSpecificFields || showExchangeField) && (
        <AssetSpecificFields
          data={data}
          errors={errors}
          onChange={onChange}
          showManualFxRate={layout.showManualFxRate}
          showExchange={showExchangeField}
          showStructuralFields={showAssetSpecificFields}
        />
      )}

      
      <DirectionField data={data} errors={errors} onChange={onChange} />

      <div className="field">
        <EntryExitFields
          data={data}
          errors={errors}
          onChange={onChange}
          inputMode={effectiveInputMode}
          visibility={entryExitVisibility}
          pnlCurrency={pnlCurrency}
        />
      </div>

      {visibleBasicOptionalItems.map(renderOptionalLayoutItem)}

      
    </FormSection>
  );
};

export const AssetFields = React.memo(AssetFieldsComponent);
