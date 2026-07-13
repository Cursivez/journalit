

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Notice } from 'obsidian';
import { NumberInput, ComboBox, Select } from '../../../core';
import { Button } from '../../../ui/Button';
import { RMultipleValue } from '../../../shared/display';
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
} from '../validation';
import { formatPnL } from '../../../../utils';
import { formatCost } from '../../../../utils/formatting';
import {
  getPartialExitInfo,
  isTradeOpenWithContext,
} from '../../../../utils/tradeStatusUtils';
import { OptionType } from '../../../../services/options';
import { getPluginInstance } from '../../../../utils/pluginContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { getCurrencyOptions } from '../../../../utils/currencyConfig';
import { debounce } from '../../../../utils/debounce';
import { calculateAssetAdjustedPriceMoveValue } from '../../../../utils/priceMoveValue';
import { useEventBus } from '../../../../hooks';
import { t } from '../../../../lang/helpers';
import { filterActiveCopyAccounts } from '../../../../utils/accountCopyTrading';
import {
  TradeFormInputMode,
  TradeFormLayoutItemId,
  TradeFormLayoutSettings,
} from '../../../../settings/types';
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
import { openCreateAccountModal } from '../../../accountPage/components';
import {
  RealizedPnlSummary,
  RealizedPnlSummaryProps,
} from './RealizedPnlSummary';

const parseCommissionType = (value: string): 'fixed' | 'percentage' =>
  value === 'percentage' ? 'percentage' : 'fixed';

const EMPTY_INSTRUMENTS: Array<{ id: string; name: string }> = [];

const ASSET_SPECIFIC_ERROR_FIELDS: Array<keyof TradeFormErrors> = [
  'exchange',
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
  'tradingPair',
  'cryptoExchange',
  'leverageRatio',
];

export const hasAssetSpecificValidationErrors = (
  errors: TradeFormErrors
): boolean =>
  ASSET_SPECIFIC_ERROR_FIELDS.some((field) => Boolean(errors[field]));

export const shouldShowTradingCostsSection = (
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

export const shouldShowRebateField = (
  data: Partial<TradeFormData>,
  errors: TradeFormErrors
): boolean => data.assetType === 'options' || Boolean(errors.rebate);

export function resolveEffectiveTradeFormInputMode({
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

export function getRealizedPnlSummaryProps({
  data,
  pnl,
  effectiveRiskAmount,
  pnlCurrency,
  displayRMultiples,
}: {
  data: Partial<TradeFormData>;
  pnl: number;
  effectiveRiskAmount?: number;
  pnlCurrency: string;
  displayRMultiples: boolean;
}): RealizedPnlSummaryProps | null {
  const isOpen = isTradeOpenWithContext({
    tradeStatus: data.tradeStatus,
    exitTime: data.exitTime,
    exitPrice: data.exitPrice,
    pnl: data.pnl,
    useDirectPnLInput: data.useDirectPnLInput,
    exits: data.exits,
    entries: data.entries,
  });

  if (!isOpen) return null;

  const partialInfo = getPartialExitInfo(data);
  if (!partialInfo.isPartialExit) return null;

  return {
    realizedPnL: pnl,
    closedSize: partialInfo.closedSize,
    totalSize: partialInfo.totalSize,
    pnlCurrency,
    displayRMultiples,
    pnlRMultiple:
      effectiveRiskAmount && effectiveRiskAmount > 0
        ? pnl / effectiveRiskAmount
        : undefined,
  };
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
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

const createTakeProfitClientId = (): string =>
  `take-profit-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function TakeProfitsSection({
  takeProfits,
  errors,
  pricePrecision,
  onChange,
}: TakeProfitsSectionProps) {
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
    field: 'price' | 'closePercent',
    value: number | undefined
  ) => {
    onChange(
      'takeProfits',
      takeProfits.map((target, targetIndex) =>
        targetIndex === index
          ? { ...target, clientId: getTakeProfitKey(target), [field]: value }
          : target
      )
    );
  };

  const addTakeProfit = () => {
    if (
      takeProfits.length === 1 &&
      (takeProfits[0].closePercent === undefined ||
        takeProfits[0].closePercent === 100)
    ) {
      onChange('takeProfits', [
        { ...takeProfits[0], closePercent: 50 },
        { clientId: createTakeProfitClientId(), closePercent: 50 },
      ]);
      return;
    }

    const allocatedPercent = takeProfits.reduce(
      (total, target) => total + (target.closePercent || 0),
      0
    );
    const remainingPercent = Math.max(0, 100 - allocatedPercent);
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
            <span>{t('form.field.close-percent')}</span>
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
  const plugin = getPluginInstance();
  const maeMfeInputMode = plugin?.settings.trade.maeMfeInputMode;
  const showPriceFields = maeMfeInputMode === 'price';
  const showDollarFields = maeMfeInputMode !== 'price';
  const isShort =
    data.direction?.toUpperCase() === 'SHORT' ||
    data.direction?.toUpperCase() === 'SELL';
  const takeProfits = data.takeProfits || [];
  const pricePrecision = data.assetType === 'forex' ? 5 : 2;
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
            pricePrecision={pricePrecision}
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
                    {formatPnL(
                      calculateAssetAdjustedPriceMoveValue(
                        data,
                        isShort
                          ? data.entryPrice - data.maePrice
                          : data.maePrice - data.entryPrice,
                        data.positionSize
                      ),
                      false,
                      pnlCurrency
                    )}
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
                    {formatPnL(
                      calculateAssetAdjustedPriceMoveValue(
                        data,
                        isShort
                          ? data.entryPrice - data.mfePrice
                          : data.mfePrice - data.entryPrice,
                        data.positionSize
                      ),
                      false,
                      pnlCurrency
                    )}
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
}: EntryExitSectionProps) {
  if (!data.assetType) return null;

  return (
    <div className="asset-specific-fields">
      {data.assetType === 'stock' && (
        <StockFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === 'options' && (
        <OptionsFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === 'futures' && (
        <FuturesFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === 'forex' && (
        <ForexFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === 'crypto' && (
        <CryptoFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === 'cfd' && (
        <CFDFields data={data} errors={errors} onChange={onChange} />
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
      <label className="label" id="direction-label">
        {t('form.field.direction')}
        <span className="required-indicator">*</span>
      </label>
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

function AssetTypeField({ data, errors, onChange }: EntryExitSectionProps) {
  const assetTypeOptions = [
    { type: 'stock', label: t('form.field.asset-type.stock') },
    { type: 'options', label: t('form.field.asset-type.options') },
    { type: 'futures', label: t('form.field.asset-type.futures') },
    { type: 'forex', label: t('form.field.asset-type.forex') },
    { type: 'crypto', label: t('form.field.asset-type.crypto') },
    { type: 'cfd', label: t('form.field.asset-type.cfd') },
  ];

  return (
    <div className="field">
      <label className="label" id="assetType-label">
        {t('form.field.asset-type')}
        <span className="required-indicator">*</span>
      </label>
      <div
        className="asset-type-container"
        role="radiogroup"
        aria-labelledby="assetType-label"
        aria-required="true"
      >
        {assetTypeOptions.map(({ type, label }) => (
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

function useAssetFieldsModel({
  data,
  onChange,
  onAccountRequirementChange,
}: Pick<AssetFieldsProps, 'data' | 'onChange' | 'onAccountRequirementChange'>) {
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
      const allAccountNames = [
        ...new Set([
          ...catalogAccounts.map((account: { name: string }) => account.name),
          ...uniqueAccounts,
        ]),
      ];
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

  useEffect(() => {
    if (!data.instrument || !data.assetType) {
      if (
        data.assetType !== 'cfd' &&
        previousCurrencyAssetTypeRef.current === 'cfd' &&
        data.currency !== undefined
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
      data.currency !== undefined
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
  }, [data.instrument, data.assetType, data.currency, data.filePath, onChange]);

  
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
      onChange('instrument', '');
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
          onChange('lotSize', specs.lotSize);
        } else {
          
          onChange('pipValue', undefined);
          onChange('lotSize', undefined);
        }
      } else {
        
        onChange('pipValue', undefined);
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
  const effectiveRiskAmount = useMemo(
    () => resolveEffectiveRiskAmount(data, defaultRiskAmount),
    [data, defaultRiskAmount]
  );

  
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

  const handleCreateAccount = useCallback(() => {
    const plugin = getPluginInstance();
    if (!plugin) {
      console.error('Failed to open create account modal: plugin unavailable');
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
      }
    );
  }, [loadAccountOptions]);

  return {
    pnlCurrency,
    tradeCurrencyOptions,
    requiresAccount,
    accountOptions,
    instrumentOptions,
    isLoadingAccounts,
    pnl,
    debouncedOnChange,
    displayRMultiples,
    defaultRiskAmount,
    effectiveRiskAmount,
    shouldDisplaySwap,
    getInstrumentLabel,
    handleCreateAccount,
    handleSaveInstrument,
    hasExplicitCurrencySelectionRef,
  };
}

interface BasicLayoutVisibilityState {
  layoutVisibleBasicOptionalItems: TradeFormLayoutItemId[];
  visibleRiskGroups: TradeFormLayoutItemId[];
  visibleCostGroups: TradeFormLayoutItemId[];
  showTradingCosts: boolean;
  showAssetSpecificFields: boolean;
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
  const {
    pnlCurrency,
    tradeCurrencyOptions,
    requiresAccount,
    accountOptions,
    instrumentOptions,
    isLoadingAccounts,
    pnl,
    debouncedOnChange,
    displayRMultiples,
    defaultRiskAmount,
    effectiveRiskAmount,
    shouldDisplaySwap,
    getInstrumentLabel,
    handleCreateAccount,
    handleSaveInstrument,
    hasExplicitCurrencySelectionRef,
  } = useAssetFieldsModel({ data, onChange, onAccountRequirementChange });

  const {
    layoutVisibleBasicOptionalItems,
    visibleRiskGroups,
    visibleCostGroups,
    showTradingCosts,
    showAssetSpecificFields,
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
  const showRealizedPnlPreview = isTradeFormLayoutItemVisible(
    layout,
    'realizedPnlPreview'
  );
  const showIdealExits =
    isTradeFormLayoutItemVisible(layout, 'idealExits') ||
    (isEditMode && hasPopulatedTradeFormLayoutItem(data, 'idealExits'));
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
  const realizedPnlSummaryProps = getRealizedPnlSummaryProps({
    data,
    pnl,
    effectiveRiskAmount,
    pnlCurrency,
    displayRMultiples,
  });
  const realizedPnlPreview = realizedPnlSummaryProps ? (
    <RealizedPnlSummary {...realizedPnlSummaryProps} />
  ) : null;
  let tradingCostsRendered = false;
  let riskManagementRendered = false;

  const renderOptionalLayoutItem = (itemId: TradeFormLayoutItemId) => {
    switch (itemId) {
      case 'assetSpecific':
        return showAssetSpecificFields ? (
          <AssetSpecificFields
            key={itemId}
            data={data}
            errors={errors}
            onChange={onChange}
          />
        ) : null;
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
      case 'pnlPreview':
        return null;
      case 'realizedPnlPreview':
        return showRealizedPnlPreview ? (
          <React.Fragment key={itemId}>{realizedPnlPreview}</React.Fragment>
        ) : null;
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
          <ComboBox
            label={t('form.field.account')}
            options={accountOptions}
            value={Array.isArray(data.account) ? data.account : []}
            onChange={(value) => {
              
              const selectedNames = Array.isArray(value)
                ? [...value]
                : value
                  ? [value]
                  : [];

              onChange('account', selectedNames);
            }}
            error={errors.account}
            allowCreate={false} 
            isMulti={true}
            optionType={OptionType.ACCOUNT}
            required={!data.isMissedTrade && !data.isBacktestTrade}
            placeholder={t('form.placeholder.select-accounts')}
          />
        )}
        {!isLoadingAccounts &&
          accountOptions.length === 0 &&
          requiresAccount && (
            <div className="trade-form-account-empty-state" role="status">
              <div className="trade-form-account-empty-state-header">
                <div className="trade-form-account-empty-state-title">
                  {t('form.account-empty-state.title')}
                </div>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => void handleCreateAccount()}
                  className="trade-form-account-empty-state-button"
                >
                  {t('form.account-empty-state.create-account')}
                </Button>
              </div>
            </div>
          )}
      </div>

      {showAssetTypeSelector && (
        <AssetTypeField data={data} errors={errors} onChange={onChange} />
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
          optionType={OptionType.INSTRUMENT}
          onSaveOption={handleSaveInstrument}
          required={true}
        />
      </div>

      {data.assetType === 'cfd' && (
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
      )}

      
      {showAssetSpecificFields && (
        <AssetSpecificFields data={data} errors={errors} onChange={onChange} />
      )}

      
      <DirectionField data={data} errors={errors} onChange={onChange} />

      <div className="field">
        <EntryExitFields
          data={data}
          errors={errors}
          onChange={onChange}
          inputMode={effectiveInputMode}
          showIdealExits={showIdealExits}
        />
      </div>

      {visibleBasicOptionalItems.map(renderOptionalLayoutItem)}

      
    </FormSection>
  );
};

export const AssetFields = React.memo(AssetFieldsComponent);
