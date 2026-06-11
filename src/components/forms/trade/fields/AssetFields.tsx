

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
import { FormSection } from '../FormSection';
import {
  TradeFormData,
  TradeFormErrors,
  TradeFormValue,
  AssetType,
  DEFAULT_TRADE_FORM_DATA,
} from '../types';
import {
  calculatePnL,
  calculatePercentageReturn,
  calculateStopLossRiskAmount,
  canCalculateStopLossRiskAmount,
  calculateTotalCosts,
  resolveEffectiveRiskAmount,
} from '../validation';
import { getApp, formatPnL } from '../../../../utils';
import { formatCost } from '../../../../utils/formatting';
import {
  getPartialExitInfo,
  isTradeOpenWithContext,
} from '../../../../utils/tradeStatusUtils';
import { OptionType } from '../../../../services/options';
import { getPluginInstance } from '../../../../utils/pluginContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { getCurrencyOptions } from '../../../../utils/currencyConfig';
import {
  injectAssetFieldsStyles,
  removeAssetFieldsStyles,
} from '../../../../styles/assetFieldsStyles';
import { debounce } from '../../../../utils/debounce';
import { calculateAssetAdjustedPriceMoveValue } from '../../../../utils/priceMoveValue';
import { useEventBus } from '../../../../hooks';
import { t } from '../../../../lang/helpers';
import { filterActiveCopyAccounts } from '../../../../utils/accountCopyTrading';


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

const EMPTY_INSTRUMENTS: Array<{ id: string; name: string }> = [];

interface AssetFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  
  instruments?: Array<{ id: string; name: string }>;
  
  onAccountRequirementChange?: (isBlocked: boolean) => void;
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
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

function TradingCostsSection({
  data,
  errors,
  pnlCurrency,
  shouldDisplaySwap,
  onChange,
}: TradingCostsSectionProps) {
  return (
    <div className="trading-costs-section">
      <h4 className="section-title">{t('form.section.trading-costs')}</h4>
      <div
        className={`cost-fields ${shouldDisplaySwap ? 'three-column' : 'two-column'}`}
      >
        <div className="field">
          <div className="commission-grid">
            <NumberInput
              label={t('form.field.commission')}
              value={data.commission}
              onChange={(value) => {
                onChange('commission', value);
                onChange('hasExplicitCommission', true);
              }}
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
                onChange('commissionType', value as 'fixed' | 'percentage')
              }
            />
          </div>
        </div>

        {data.assetType === AssetType.OPTIONS && (
          <div className="field">
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

        {shouldDisplaySwap && (
          <div className="field">
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

        <div className="field">
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
      </div>
    </div>
  );
}

interface RiskManagementSectionProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  pnlCurrency: string;
  defaultRiskAmount: number;
  displayRMultiples: boolean;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

function RiskManagementSection({
  data,
  errors,
  pnlCurrency,
  defaultRiskAmount,
  displayRMultiples,
  onChange,
}: RiskManagementSectionProps) {
  const plugin = getApp().plugins?.plugins?.['journalit'];
  const maeMfeInputMode = plugin?.settings?.trade?.maeMfeInputMode;
  const showPriceFields = maeMfeInputMode === 'price';
  const showDollarFields = maeMfeInputMode !== 'price';
  const isShort =
    data.direction?.toUpperCase() === 'SHORT' ||
    data.direction?.toUpperCase() === 'SELL';

  return (
    <div className="risk-management-section">
      <h4 className="section-title">{t('form.section.risk-management')}</h4>
      <div className="risk-fields">
        <div className="field">
          <NumberInput
            label={t('form.field.stop-loss')}
            value={data.stopLoss}
            onChange={(value) => onChange('stopLoss', value)}
            error={errors.stopLoss}
            precision={data.assetType === AssetType.FOREX ? 5 : 2}
            allowDecimal={true}
            placeholder={t('form.placeholder.stop-loss')}
          />
        </div>

        <div className="field">
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

        {showPriceFields && (
          <div className="field">
            <NumberInput
              label={isShort ? 'MAE Price (High)' : 'MAE Price (Low)'}
              value={data.maePrice}
              onChange={(value) => onChange('maePrice', value)}
              error={errors.maePrice}
              precision={data.assetType === AssetType.FOREX ? 5 : 2}
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
        )}

        {showPriceFields && (
          <div className="field">
            <NumberInput
              label={isShort ? 'MFE Price (Low)' : 'MFE Price (High)'}
              value={data.mfePrice}
              onChange={(value) => onChange('mfePrice', value)}
              error={errors.mfePrice}
              precision={data.assetType === AssetType.FOREX ? 5 : 2}
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
        )}

        {showDollarFields && (
          <div className="field">
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
        )}

        {showDollarFields && (
          <div className="field">
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
      {data.assetType === AssetType.STOCK && (
        <StockFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === AssetType.OPTIONS && (
        <OptionsFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === AssetType.FUTURES && (
        <FuturesFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === AssetType.FOREX && (
        <ForexFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === AssetType.CRYPTO && (
        <CryptoFields data={data} errors={errors} onChange={onChange} />
      )}
      {data.assetType === AssetType.CFD && (
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
  if (data.assetType === AssetType.OPTIONS) return null;

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
    { type: AssetType.STOCK, label: t('form.field.asset-type.stock') },
    { type: AssetType.OPTIONS, label: t('form.field.asset-type.options') },
    { type: AssetType.FUTURES, label: t('form.field.asset-type.futures') },
    { type: AssetType.FOREX, label: t('form.field.asset-type.forex') },
    { type: AssetType.CRYPTO, label: t('form.field.asset-type.crypto') },
    { type: AssetType.CFD, label: t('form.field.asset-type.cfd') },
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

      const plugin = getApp().plugins?.plugins?.['journalit'];
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
        plugin?.settings?.account?.accountMetadata,
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
    
    loadAccountOptions();

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

    
    const saveTimeout = setTimeout(async () => {
      try {
        await optionsService.setFuturesDataForInstrument(instrument, {
          dollarPerPoint: data.dollarPerPoint,
          tickSize: data.tickSize,
          tickValue: data.tickValue,
        });
      } catch (error) {
        console.error('Failed to save futures data for instrument:', error);
      }
    }, 1000);

    
    return () => clearTimeout(saveTimeout);
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

    const saveTimeout = setTimeout(async () => {
      try {
        await optionsService.setCfdDataForInstrument(instrument, {
          contractSize: data.contractSize,
        });
      } catch (error) {
        console.error('Failed to save CFD data for instrument:', error);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [data.assetType, data.instrument, data.contractSize, data.filePath]);

  
  
  const pnl = calculatePnL(data);
  const percentReturn = calculatePercentageReturn(data);

  
  const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange]);

  
  useEffect(() => {}, []);

  
  const plugin = getApp().plugins?.plugins?.['journalit'];
  const displayRMultiples = plugin?.settings?.trade?.displayRMultiples ?? false;
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount ?? 0;
  const effectiveRiskAmount = useMemo(
    () => resolveEffectiveRiskAmount(data, defaultRiskAmount),
    [data, defaultRiskAmount]
  );

  
  const shouldDisplaySwap =
    data.assetType === 'forex' || data.assetType === 'cfd';

  
  const getInstrumentLabel = (): string => {
    switch (data.assetType) {
      case AssetType.STOCK:
        return t('form.field.instrument.ticker');
      case AssetType.OPTIONS:
        return t('form.field.instrument.option-symbol');
      case AssetType.FUTURES:
        return t('form.field.instrument.future-symbol');
      case AssetType.FOREX:
        return t('form.field.instrument.forex-pair');
      case AssetType.CRYPTO:
        return t('form.field.instrument.crypto-symbol');
      case AssetType.CFD:
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
    percentReturn,
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

const AssetFieldsComponent: React.FC<AssetFieldsProps> = ({
  data,
  errors,
  onChange,
  instruments: _instruments = EMPTY_INSTRUMENTS,
  onAccountRequirementChange,
}) => {
  const {
    pnlCurrency,
    tradeCurrencyOptions,
    requiresAccount,
    accountOptions,
    instrumentOptions,
    isLoadingAccounts,
    pnl,
    percentReturn,
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
                  onClick={handleCreateAccount}
                  className="trade-form-account-empty-state-button"
                >
                  {t('form.account-empty-state.create-account')}
                </Button>
              </div>
            </div>
          )}
      </div>

      <AssetTypeField data={data} errors={errors} onChange={onChange} />

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

      {data.assetType === AssetType.CFD && (
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

      
      <AssetSpecificFields data={data} errors={errors} onChange={onChange} />

      
      <DirectionField data={data} errors={errors} onChange={onChange} />

      <div className="field">
        <EntryExitFields data={data} errors={errors} onChange={onChange} />
      </div>

      
      <TradingCostsSection
        data={data}
        errors={errors}
        pnlCurrency={pnlCurrency}
        shouldDisplaySwap={shouldDisplaySwap}
        onChange={debouncedOnChange}
      />

      
      <RiskManagementSection
        data={data}
        errors={errors}
        pnlCurrency={pnlCurrency}
        defaultRiskAmount={defaultRiskAmount}
        displayRMultiples={displayRMultiples}
        onChange={debouncedOnChange}
      />

      
      {data.entryPrice !== undefined &&
        data.exitPrice !== undefined &&
        data.positionSize !== undefined &&
        data.direction !== undefined &&
        (() => {
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
            <div className="calculatedValue">
              <span className="calculatedLabel">
                {t('form.field.profit-loss')}
                {data.commission || data.swap || data.fees
                  ? ` ${t('form.field.incl-costs')}`
                  : ''}
              </span>
              <span
                className={`calculatedAmount ${pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : 'neutral'}`}
              >
                {formatPnL(
                  pnl,
                  true,
                  pnlCurrency,
                  displayRMultiples,
                  pnlRMultiple
                )}
              </span>
              {!data.useDirectPnLInput && (
                <span className="calculatedLabel">
                  ({percentReturn.toFixed(2)}%)
                </span>
              )}
              {data.commission || data.swap || data.fees ? (
                <span className="calculatedLabel">
                  {t('form.field.total-costs')}{' '}
                  {formatPnL(
                    totalCosts,
                    true,
                    pnlCurrency,
                    displayRMultiples,
                    costsRMultiple
                  )}
                </span>
              ) : null}
            </div>
          );
        })()}

      
      {(() => {
        const summaryProps = getRealizedPnlSummaryProps({
          data,
          pnl,
          effectiveRiskAmount,
          pnlCurrency,
          displayRMultiples,
        });

        return summaryProps ? <RealizedPnlSummary {...summaryProps} /> : null;
      })()}

      
    </FormSection>
  );
};

export const AssetFields = React.memo(AssetFieldsComponent);
