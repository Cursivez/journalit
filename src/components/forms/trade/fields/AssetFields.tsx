

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
import {
  TradeFormData,
  TradeFormErrors,
  TradeFormValue,
  DEFAULT_TRADE_FORM_DATA,
} from '../types';
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
import { openCreateAccountModal } from '../../../accountPage/components/CreateAccountModal';
import { useForexPnlConversionRate } from './hooks/useForexPnlConversionRate';

const parseCommissionType = (value: string): 'fixed' | 'percentage' =>
  value === 'percentage' ? 'percentage' : 'fixed';

const EMPTY_INSTRUMENTS: Array<{ id: string; name: string }> = [];

export function mergeActiveTradeFormAccountNames(
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


export function shouldShowDirectPnlToggle({
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

function TradingCostsSection({
  data,
  errors,
  pnlCurrency,
  shouldDisplaySwap,
  visibleCostGroups,
  onChange,
}: TradingCostsSectionProps) {
  const showCommission =
    visibleCostGroups.includes('tradingCosts') ||
    Boolean(errors.commission || errors.commissionType);
  const showRebate =
    (visibleCostGroups.includes('tradingCostRebate') &&
      shouldShowRebateField(data, errors)) ||
    Boolean(errors.rebate);
  const showSwap =
    (visibleCostGroups.includes('tradingCostSwap') &&
      (shouldDisplaySwap ||
        (data.swap !== undefined && data.swap !== null && data.swap !== 0))) ||
    Boolean(errors.swap);
  const showFees =
    visibleCostGroups.includes('tradingCostFees') || Boolean(errors.fees);
  return (
    <div className="trading-costs-section">
      <h4 className="section-title">{t('form.section.trading-costs')}</h4>
      <div
        className={`cost-fields ${shouldDisplaySwap ? 'three-column' : 'two-column'}`}
      >
        {showCommission && (
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
    <div className="take-profits-section">
      <div className="take-profits-header">
        <div className="label">{t('form.section.take-profits')}</div>
        <Button
          type="button"
          variant="plain"
          size="small"
          className="take-profit-add-button"
          onClick={addTakeProfit}
          aria-label={t('form.action.add-take-profit')}
        >
          + {t('button.add')}
        </Button>
      </div>
      {takeProfits.length > 0 && (
        <div className="take-profits-list">
          <div className="take-profit-row take-profit-row-header">
            <span>{t('form.field.take-profit-short')}</span>
            <span>{t('form.field.target-price')}</span>
            <span>
              {useSizeUnit
                ? t('form.field.close-size')
                : t('form.field.close-percent')}
            </span>
            <span aria-hidden="true" />
          </div>
          {takeProfits.map((target, index) => (
            <div className="take-profit-row" key={getTakeProfitKey(target)}>
              <span className="take-profit-index-label">TP{index + 1}</span>
              <NumberInput
                aria-label={`${t('form.field.target-price')} ${index + 1}`}
                value={target.price}
                onChange={(value) => updateTakeProfit(index, 'price', value)}
                error={errors.takeProfits?.[index]?.price}
                precision={pricePrecision}
                allowDecimal={true}
                placeholder={t('form.placeholder.target-price')}
              />
              {useSizeUnit ? (
                <NumberInput
                  aria-label={`${t('form.field.close-size')} ${index + 1}`}
                  value={target.size}
                  onChange={(value) => updateTakeProfit(index, 'size', value)}
                  error={errors.takeProfits?.[index]?.size}
                  min={0}
                  precision={sizePrecision}
                  allowDecimal={sizePrecision > 0}
                  placeholder={t('form.placeholder.close-size')}
                />
              ) : (
                <NumberInput
                  aria-label={`${t('form.field.close-percent')} ${index + 1}`}
                  value={target.closePercent}
                  onChange={(value) =>
                    updateTakeProfit(index, 'closePercent', value)
                  }
                  error={errors.takeProfits?.[index]?.closePercent}
                  min={0}
                  max={100}
                  precision={0}
                  allowDecimal={false}
                  placeholder={t('form.placeholder.close-percent')}
                />
              )}
              <Button
                type="button"
                variant="plain"
                size="small"
                className="take-profit-remove-button"
                onClick={() => removeTakeProfit(index)}
                aria-label={t('form.action.remove-take-profit')}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
      {takeProfits.length === 0 && (
        <div className="take-profits-empty-state">
          <span>{t('form.empty.take-profits')}</span>
        </div>
      )}
    </div>
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
  const pricePrecision = data.assetType === 'forex' ? 5 : 2;
  const takeProfitUnit = resolveTradeFormLayoutSettings(
    plugin?.settings.trade.tradeFormLayout
  ).takeProfitUnit;
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
          <div className="field" key={fieldId}>
            <NumberInput
              label={t('form.field.stop-loss')}
              value={data.stopLoss}
              onChange={(value) => onChange('stopLoss', value)}
              error={errors.stopLoss}
              precision={pricePrecision}
              allowDecimal={true}
              placeholder={t('form.placeholder.stop-loss')}
            />
          </div>
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
        elements.push(renderRiskField('stopLoss'));
        elements.push(renderRiskField('riskAmount'));
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

  
  
  
  
  
  const exchangeField =
    data.assetType === 'stock' ? (
      <StockFields data={data} errors={errors} onChange={onChange} />
    ) : data.assetType === 'crypto' ? (
      <CryptoFields data={data} errors={errors} onChange={onChange} />
    ) : null;

  const structuralField =
    data.assetType === 'options' ? (
      <OptionsFields data={data} errors={errors} onChange={onChange} />
    ) : data.assetType === 'futures' ? (
      <FuturesFields data={data} errors={errors} onChange={onChange} />
    ) : data.assetType === 'forex' ? (
      <ForexFields
        data={data}
        errors={errors}
        onChange={onChange}
        showManualFxRate={showManualFxRate}
      />
    ) : data.assetType === 'cfd' ? (
      <CFDFields data={data} errors={errors} onChange={onChange} />
    ) : null;

  const exchangeFields = showExchange ? exchangeField : null;
  const structuralFields = showStructuralFields ? structuralField : null;

  if (!exchangeFields && !structuralFields) return null;

  return (
    <div className="asset-specific-fields">
      {exchangeFields}
      {structuralFields}
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

export function shouldClearAutoDerivedCfdCurrencyOnAssetTypeChange({
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

    
    if (data.assetType === 'futures') {
      let appliedSpecs = false;

      
      if (specService) {
        const specs = specService.getSpecsForSymbol(data.instrument, 'futures');
        if (specs && 'dollarPerPoint' in specs) {
          onChange('dollarPerPoint', specs.dollarPerPoint);
          onChange('tickSize', specs.tickSize);
          onChange('tickValue', specs.tickValue);
          appliedSpecs = true;
        }
      }

      
      if (!appliedSpecs) {
        try {
          const futuresData = optionsService.getFuturesDataForInstrument(
            data.instrument
          );
          if (futuresData) {
            if (
              futuresData.dollarPerPoint !== undefined &&
              futuresData.dollarPerPoint !== 0
            ) {
              onChange('dollarPerPoint', futuresData.dollarPerPoint);
            } else {
              onChange('dollarPerPoint', undefined);
            }

            if (futuresData.tickSize !== undefined) {
              onChange('tickSize', futuresData.tickSize);
            } else {
              onChange('tickSize', undefined);
            }

            if (futuresData.tickValue !== undefined) {
              onChange('tickValue', futuresData.tickValue);
            } else {
              onChange('tickValue', undefined);
            }
          } else {
            
            onChange('dollarPerPoint', undefined);
            onChange('tickSize', undefined);
            onChange('tickValue', undefined);
          }
        } catch (error) {
          console.error(
            'Failed to load futures data from CustomOptionsService:',
            error
          );
          
          onChange('dollarPerPoint', undefined);
          onChange('tickSize', undefined);
          onChange('tickValue', undefined);
        }
      }
    }

    
    if (data.assetType === 'forex') {
      
      if (specService) {
        const specs = specService.getSpecsForSymbol(data.instrument, 'forex');
        if (specs && 'lotSize' in specs && 'pipValue' in specs) {
          onChange('pipValue', specs.pipValue);
          onChange('pipSize', specs.pipSize);
          onChange('lotSize', specs.lotSize);
        } else {
          
          onChange('pipValue', undefined);
          onChange('pipSize', undefined);
          onChange('lotSize', undefined);
        }
      } else {
        
        onChange('pipValue', undefined);
        onChange('pipSize', undefined);
        onChange('lotSize', undefined);
      }
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

      let appliedSpecs = false;

      if (specService) {
        const specs = specService.getSpecsForSymbol(data.instrument, 'cfd');
        if (specs && 'contractSize' in specs) {
          onChange('contractSize', specs.contractSize);
          appliedSpecs = true;
        }
      }

      if (!appliedSpecs) {
        try {
          const cfdData = optionsService.getCfdDataForInstrument(
            data.instrument
          );
          if (cfdData?.contractSize !== undefined && cfdData.contractSize > 0) {
            onChange('contractSize', cfdData.contractSize);
          } else {
            onChange('contractSize', undefined);
          }
        } catch (error) {
          console.error(
            'Failed to load CFD data from CustomOptionsService:',
            error
          );
          onChange('contractSize', undefined);
        }
      }
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
        if (data.contractSize !== DEFAULT_TRADE_FORM_DATA.contractSize) {
          onChange('contractSize', DEFAULT_TRADE_FORM_DATA.contractSize);
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
          Boolean(errors.stopLoss || errors.riskAmount)) ||
        (itemId === 'takeProfits' && Boolean(errors.takeProfits)) ||
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
  const preserveManualTradeCurrency =
    isTradeFormLayoutItemVisible(layout, 'tradeCurrency') ||
    (isEditMode && hasPopulatedTradeFormLayoutItem(data, 'tradeCurrency'));
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
  const errorVisibleBasicItems = new Set<TradeFormLayoutItemId>();
  if (
    errors.commission ||
    errors.commissionType ||
    errors.rebate ||
    errors.swap ||
    errors.fees
  ) {
    errorVisibleBasicItems.add('tradingCosts');
  }
  if (errors.stopLoss || errors.riskAmount) {
    errorVisibleBasicItems.add('riskPlanning');
  }
  if (errors.takeProfits) {
    errorVisibleBasicItems.add('takeProfits');
  }
  if (errors.mae || errors.maePrice || errors.mfe || errors.mfePrice) {
    errorVisibleBasicItems.add('maeMfe');
  }
  if (errors.fxRate) {
    errorVisibleBasicItems.add('tradeCurrency');
  }
  const visibleBasicOptionalItems = [...layoutVisibleBasicOptionalItems];
  const visibleBasicOptionalItemSet = new Set(visibleBasicOptionalItems);
  for (const itemId of TRADE_FORM_BASIC_OPTIONAL_ITEM_IDS) {
    if (
      errorVisibleBasicItems.has(itemId) &&
      !visibleBasicOptionalItemSet.has(itemId)
    ) {
      visibleBasicOptionalItems.push(itemId);
      visibleBasicOptionalItemSet.add(itemId);
    }
  }
  const showDirectPnlToggle = shouldShowDirectPnlToggle({
    isLayoutVisible: isTradeFormLayoutItemVisible(layout, 'directPnlToggle'),
    isEditMode,
    data,
    hasDirectPnlError: Boolean(errors.directPnL),
  });
  const showIdealExits =
    isTradeFormLayoutItemVisible(layout, 'idealExits') ||
    (isEditMode && hasPopulatedTradeFormLayoutItem(data, 'idealExits'));
  
  
  
  const showUnrealizedSnapshot =
    !areSnapshotKeysClaimedByCustomFields(
      getPluginInstance()?.customFieldsService?.getFields()
    ) &&
    (isTradeFormLayoutItemVisible(layout, 'unrealizedSnapshot') ||
      (isEditMode &&
        hasPopulatedTradeFormLayoutItem(data, 'unrealizedSnapshot')));
  const showDividends =
    isTradeFormLayoutItemVisible(layout, 'dividends') ||
    (isEditMode && hasPopulatedTradeFormLayoutItem(data, 'dividends'));
  const fixedAssetType =
    layout.assetTypeMode === 'fixed' ? layout.defaultAssetType : undefined;
  const showAssetTypeSelector =
    fixedAssetType === undefined || data.assetType !== fixedAssetType;
  const isOpenTrade =
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
  const effectiveInputMode = resolveEffectiveTradeFormInputMode({
    layoutInputMode: layout.inputMode,
    forcePriceInputMode,
    isOpenTrade,
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
            onRequestCreateAccount={handleCreateAccount}
          />
        )}
        <PropChallengePhaseHint data={data} />
        {isAccountCreationBlocked && (
          <AccountEmptyState onCreateAccount={handleCreateAccount} />
        )}
      </div>

      {showAssetTypeSelector && (
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

      {visibleBasicOptionalItemSet.has('tradeCurrency') ? (
        <TradeCurrencySection
          data={data}
          errors={errors}
          globalCurrency={globalCurrency}
          tradeCurrencyOptions={tradeCurrencyOptions}
          showManualFxRate={layout.showManualFxRate}
          onTradeCurrencyChange={(value) => {
            hasExplicitCurrencySelectionRef.current = true;
            onChange('currency', value);
          }}
          onChange={onChange}
        />
      ) : (
        data.assetType === 'cfd' && (
          <div className="field">
            <Select
              label={t('settings.general.currency')}
              value={data.currency || '__NONE__'}
              onChange={(value) => {
                hasExplicitCurrencySelectionRef.current = true;
                onChange('currency', value === '__NONE__' ? undefined : value);
              }}
              options={tradeCurrencyOptions}
              id="trade-currency-select"
            />
          </div>
        )
      )}

      
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
          visibility={{
            idealExits: showIdealExits,
            unrealizedSnapshot: showUnrealizedSnapshot,
            dividends: showDividends,
            directPnlToggle: showDirectPnlToggle,
          }}
          pnlCurrency={pnlCurrency}
        />
      </div>

      {visibleBasicOptionalItems.map(renderOptionalLayoutItem)}

      
    </FormSection>
  );
};

export const AssetFields = React.memo(AssetFieldsComponent);
