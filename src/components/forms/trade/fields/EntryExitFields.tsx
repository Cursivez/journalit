

import React, { useEffect, useCallback, useMemo } from 'react';
import {
  injectEntryExitStyles,
  removeEntryExitStyles,
} from '../../../../styles/entryExitStyles';
import { NumberInput, FastDateTimeInput } from '../../../core';
import { Button } from '../../../ui/Button';
import ToggleSwitch from '../../../ui/ToggleSwitch';
import {
  AssetType,
  DividendTransaction,
  EntryTransaction,
  ExitTransaction,
  TradeFormData,
  TradeFormErrors,
  TradeFormValue,
  shouldShowTradeDividends,
} from '../types';
import {
  getPricePrecision,
  getSizePrecision,
  roundToPrecision,
} from '../utils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { normalizeTradeExecution } from '../../../../services/trade/core/TradeExecutionNormalization';

interface EntryExitFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

interface PnLModeToggleProps {
  useDirectPnLInput?: boolean;
  onToggle: (useDirectPnL: boolean) => void;
}

function PnLModeToggle({ useDirectPnLInput, onToggle }: PnLModeToggleProps) {
  return (
    <div className="journalit-pnl-mode-toggle">
      <div className="journalit-pnl-toggle-container">
        <ToggleSwitch
          checked={useDirectPnLInput || false}
          onChange={onToggle}
          id="use-direct-pnl"
          ariaLabel={t('form.entry-exit.direct-pnl')}
        />
        <label htmlFor="use-direct-pnl" className="journalit-pnl-toggle-label">
          {t('form.entry-exit.direct-pnl')}
        </label>
      </div>
      <p className="journalit-pnl-toggle-description">
        {useDirectPnLInput
          ? t('form.entry-exit.direct-pnl-desc')
          : t('form.entry-exit.calc-pnl')}
      </p>
    </div>
  );
}

function DirectPnLSection({ data, errors, onChange }: EntryExitFieldsProps) {
  if (!data.useDirectPnLInput) return null;

  return (
    <div className="journalit-direct-pnl-section">
      <div className="field">
        <NumberInput
          label={t('form.field.total-pnl')}
          value={data.directPnL}
          onChange={(value) => onChange('directPnL', value)}
          error={errors.directPnL}
          allowDecimal={true}
          precision={2}
          required={!data.isMissedTrade}
          placeholder={t('form.field.direct-pnl-placeholder')}
        />
      </div>
    </div>
  );
}

interface EntriesSectionProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  useDollarValue: boolean;
  pricePrecision: number;
  sizePrecision: number;
  totalEntrySize: number;
  blankTimeDefaultDate: Date;
  getPositionSizeLabel: () => string;
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  onEntryChange: (
    index: number,
    field: keyof EntryTransaction,
    value: unknown
  ) => void;
  onEntryDollarChange: (index: number, value: number | undefined) => void;
  onEntryPriceChangeWithDollar: (
    index: number,
    value: number | undefined
  ) => void;
}

function EntriesSection({
  data,
  errors,
  useDollarValue,
  pricePrecision,
  sizePrecision,
  totalEntrySize,
  blankTimeDefaultDate,
  getPositionSizeLabel,
  onAddEntry,
  onRemoveEntry,
  onEntryChange,
  onEntryDollarChange,
  onEntryPriceChangeWithDollar,
}: EntriesSectionProps) {
  return (
    <div className="entries-section">
      <h4 className="section-title">
        {t('form.field.entries')}{' '}
        {data.useDirectPnLInput ? t('form.field.optional') : ''}{' '}
        <span className="badge">{data.entries?.length || 0}</span>
      </h4>

      {(data.entries || []).map((entry, index) => (
        <div key={`entry-${index}`} className="entry-row">
          <div className="entry-index">{index + 1}</div>
          <div className="entry-fields">
            <div className="time-field-wrapper">
              <div className="time-field-header">
                <label className="time-field-label">
                  {t('form.field.time')}
                  {!data.isMissedTrade && !data.useDirectPnLInput && (
                    <span className="required-star">*</span>
                  )}
                </label>
                {(data.entries?.length || 0) > 1 && (
                  <button
                    type="button"
                    className="remove-button-inline"
                    onClick={() => onRemoveEntry(index)}
                    aria-label={t('form.entry-exit.remove-entry')}
                  >
                    ×
                  </button>
                )}
              </div>
              <FastDateTimeInput
                value={entry.time}
                onChange={(value) => onEntryChange(index, 'time', value)}
                onBlankTimeDateChange={(date) =>
                  onEntryChange(index, 'blankTimeDate', date)
                }
                error={errors.entries?.[index]?.time}
                includeTime={true}
                defaultDateWhenEmpty={
                  entry.blankTimeDate ?? blankTimeDefaultDate
                }
                className="time-field"
              />
            </div>

            <NumberInput
              label={t('form.field.price')}
              value={entry.price}
              onChange={(value) =>
                useDollarValue
                  ? onEntryPriceChangeWithDollar(index, value)
                  : onEntryChange(index, 'price', value)
              }
              error={errors.entries?.[index]?.price}
              min={0}
              precision={pricePrecision}
              allowDecimal={true}
              required={!data.isMissedTrade && !data.useDirectPnLInput}
              className="price-field"
            />

            {useDollarValue ? (
              <>
                <NumberInput
                  label={t('form.field.value-dollar')}
                  value={
                    entry.notional ??
                    (entry.size && entry.price
                      ? entry.size * entry.price
                      : undefined)
                  }
                  onChange={(value) => onEntryDollarChange(index, value)}
                  error={errors.entries?.[index]?.size}
                  min={0}
                  precision={2}
                  allowDecimal={true}
                  required={!data.isMissedTrade && !data.useDirectPnLInput}
                  placeholder={t('form.field.dollar-amount-placeholder')}
                  className="size-field"
                />
                {entry.price > 0 && entry.size > 0 && (
                  <div className="calculated-size">
                    = {entry.size.toFixed(sizePrecision)}{' '}
                    {getPositionSizeLabel().toLowerCase()}
                  </div>
                )}
              </>
            ) : (
              <NumberInput
                label={getPositionSizeLabel()}
                value={entry.size}
                onChange={(value) => onEntryChange(index, 'size', value)}
                error={errors.entries?.[index]?.size}
                min={0}
                precision={sizePrecision}
                required={!data.isMissedTrade && !data.useDirectPnLInput}
                className="size-field"
              />
            )}
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        className="add-button clickable-icon"
        onClick={onAddEntry}
      >
        {t('form.entry-exit.add-entry')}
      </Button>
      <div className="total-size">
        {t('form.entry-exit.total-entry-size')}{' '}
        {totalEntrySize.toFixed(sizePrecision)}
      </div>
    </div>
  );
}


function useEntryExitFieldsModel({
  data,
  onChange,
}: Pick<EntryExitFieldsProps, 'data' | 'onChange'>) {
  const plugin = usePlugin();

  
  const useDollarValue = plugin?.settings?.trade?.useDollarValueInput ?? false;

  
  const pricePrecision = getPricePrecision(data.assetType);
  const sizePrecision = getSizePrecision(data.assetType);
  const supportsDividends = shouldShowTradeDividends(data);
  const blankTimeDefaultDate = useMemo(() => new Date(), []);

  
  const handleAddEntry = () => {
    const entries = [
      ...(data.entries || []),
      {
        time: undefined,
        price: 0,
        size: 0,
      },
    ];
    onChange('entries', entries);

    
    updateAggregateFields(entries, data.exits || []);
  };

  const handleRemoveEntry = (index: number) => {
    const entries = [...(data.entries || [])];
    entries.splice(index, 1);
    onChange('entries', entries);

    
    updateAggregateFields(entries, data.exits || []);
  };

  const handleAddExit = () => {
    const exits = [
      ...(data.exits || []),
      {
        time: undefined,
        price: 0,
        size: 0,
      },
    ];
    onChange('exits', exits);

    
    updateAggregateFields(data.entries || [], exits);
  };

  const handleRemoveExit = (index: number) => {
    const exits = [...(data.exits || [])];
    exits.splice(index, 1);
    onChange('exits', exits);

    
    updateAggregateFields(data.entries || [], exits);
  };

  const handleAddDividend = () => {
    const dividends = [
      ...(data.dividends || []),
      {
        time: new Date(),
        amount: 0,
      },
    ];
    onChange('dividends', dividends);
  };

  const handleRemoveDividend = (index: number) => {
    const dividends = [...(data.dividends || [])];
    dividends.splice(index, 1);
    onChange('dividends', dividends);
  };

  
  
  const updateAggregateFields = useCallback(
    (entries: EntryTransaction[], exits: ExitTransaction[]) => {
      
      if (!entries.length && !exits.length) {
        onChange('entryPrice', undefined);
        onChange('exitPrice', undefined);
        onChange('positionSize', undefined);
        onChange('entryTime', undefined);
        onChange('exitTime', undefined);
        return;
      }

      const normalizedExecution = normalizeTradeExecution(
        {
          entries,
          exits: exits.map((exit) => ({
            ...exit,
            hasExplicitPrice: true,
          })),
          hasExplicitExitPrice: exits.length > 0 ? true : undefined,
        },
        { deriveMissingExplicitness: true }
      );

      const totalEntrySize = normalizedExecution.entries.reduce(
        (total, entry) =>
          entry.size !== null && entry.size > 0 ? total + entry.size : total,
        0
      );

      
      if (normalizedExecution.weightedEntryPrice !== null) {
        onChange('entryPrice', normalizedExecution.weightedEntryPrice);
      }
      if (totalEntrySize > 0) {
        onChange('positionSize', totalEntrySize);
      }

      
      
      if (normalizedExecution.firstEntryTime) {
        onChange('entryTime', normalizedExecution.firstEntryTime);
      }

      
      if (normalizedExecution.weightedExitPrice !== null) {
        onChange('exitPrice', normalizedExecution.weightedExitPrice);
      } else {
        onChange('exitPrice', undefined);
      }

      const hasOnlyPlaceholderExits =
        normalizedExecution.exits.length > 0 &&
        normalizedExecution.exits.every(
          (exit) => exit.price === 0 && exit.size !== null && exit.size <= 0
        );

      
      if (normalizedExecution.lastExitTime) {
        onChange('exitTime', normalizedExecution.lastExitTime);
      } else if (exits.length === 0 || hasOnlyPlaceholderExits) {
        
        onChange('exitTime', undefined);
      }
    },
    [onChange]
  );

  
  const handleEntryChange = useCallback(
    (index: number, field: keyof EntryTransaction, value: any) => {
      const entries = [...(data.entries || [])];

      
      if (field === 'time' && typeof value === 'string') {
        const parsedDate = new Date(value);
        value = isNaN(parsedDate.getTime()) ? undefined : parsedDate;
      }

      
      if (field === 'size') {
        entries[index] = {
          ...entries[index],
          [field]: value,
          notional: undefined,
        };
      } else if (field === 'time') {
        entries[index] = {
          ...entries[index],
          time: value,
          blankTimeDate: value ? undefined : entries[index]?.blankTimeDate,
        };
      } else if (field === 'blankTimeDate') {
        entries[index] = {
          ...entries[index],
          time: undefined,
          blankTimeDate: value,
        };
      } else {
        entries[index] = { ...entries[index], [field]: value };
      }
      onChange('entries', entries);

      
      updateAggregateFields(entries, data.exits || []);
    },
    [data.entries, data.exits, onChange, updateAggregateFields]
  );

  
  const handleExitChange = useCallback(
    (index: number, field: keyof ExitTransaction, value: any) => {
      const exits = [...(data.exits || [])];

      
      if (field === 'time' && typeof value === 'string') {
        const parsedDate = new Date(value);
        value = isNaN(parsedDate.getTime()) ? undefined : parsedDate;
      }

      
      if (field === 'size') {
        exits[index] = { ...exits[index], [field]: value, notional: undefined };
      } else if (field === 'time') {
        exits[index] = {
          ...exits[index],
          time: value,
          blankTimeDate: value ? undefined : exits[index]?.blankTimeDate,
        };
      } else if (field === 'blankTimeDate') {
        exits[index] = {
          ...exits[index],
          time: undefined,
          blankTimeDate: value,
        };
      } else {
        exits[index] = { ...exits[index], [field]: value };
      }
      onChange('exits', exits);

      
      updateAggregateFields(data.entries || [], exits);
    },
    [data.entries, data.exits, onChange, updateAggregateFields]
  );

  const handleDividendChange = useCallback(
    (index: number, field: keyof DividendTransaction, value: any) => {
      const dividends = [...(data.dividends || [])];

      if (field === 'time' && typeof value === 'string') {
        const parsedDate = new Date(value);
        value = isNaN(parsedDate.getTime()) ? undefined : parsedDate;
      }

      dividends[index] = { ...dividends[index], [field]: value };
      onChange('dividends', dividends);
    },
    [data.dividends, onChange]
  );

  
  const handlePnLModeToggle = async (useDirectPnL: boolean) => {
    
    onChange('useDirectPnLInput', useDirectPnL);

    
    try {
      if (plugin) {
        plugin.settings.trade = {
          ...plugin.settings.trade,
          useDirectPnLInput: useDirectPnL,
        };
        await plugin.saveSettings();
      }
    } catch (error) {
      console.error('Error saving PNL input mode preference:', error);
      
    }
  };

  
  const handleEntryDollarChange = useCallback(
    (index: number, dollarValue: number | undefined) => {
      const entries = [...(data.entries || [])];
      const entry = entries[index];

      if (dollarValue && entry?.price && entry.price > 0) {
        const calculatedSize = dollarValue / entry.price;
        const roundedSize = parseFloat(calculatedSize.toFixed(sizePrecision));
        
        entries[index] = { ...entry, size: roundedSize, notional: dollarValue };
        onChange('entries', entries);
        updateAggregateFields(entries, data.exits || []);
      } else if (entry) {
        
        entries[index] = { ...entry, size: 0, notional: dollarValue };
        onChange('entries', entries);
        updateAggregateFields(entries, data.exits || []);
      }
    },
    [data.entries, data.exits, sizePrecision, onChange, updateAggregateFields]
  );

  
  const handleExitDollarChange = useCallback(
    (index: number, dollarValue: number | undefined) => {
      const exits = [...(data.exits || [])];
      const exit = exits[index];

      if (dollarValue && exit?.price && exit.price > 0) {
        const calculatedSize = dollarValue / exit.price;
        const roundedSize = parseFloat(calculatedSize.toFixed(sizePrecision));
        
        exits[index] = { ...exit, size: roundedSize, notional: dollarValue };
        onChange('exits', exits);
        updateAggregateFields(data.entries || [], exits);
      } else if (exit) {
        
        exits[index] = { ...exit, size: 0, notional: dollarValue };
        onChange('exits', exits);
        updateAggregateFields(data.entries || [], exits);
      }
    },
    [data.entries, data.exits, sizePrecision, onChange, updateAggregateFields]
  );

  
  const handleEntryPriceChangeWithDollar = useCallback(
    (index: number, price: number | undefined) => {
      if (useDollarValue && price && price > 0) {
        const entry = (data.entries || [])[index];
        const dollarValue = entry?.notional;
        if (dollarValue) {
          const calculatedSize = dollarValue / price;
          const roundedSize = parseFloat(calculatedSize.toFixed(sizePrecision));

          
          const entries = [...(data.entries || [])];
          entries[index] = {
            ...entries[index],
            price,
            size: roundedSize,
            notional: dollarValue,
          };
          onChange('entries', entries);
          updateAggregateFields(entries, data.exits || []);
          return;
        }
      }
      
      handleEntryChange(index, 'price', price);
    },
    [
      useDollarValue,
      data.entries,
      data.exits,
      sizePrecision,
      onChange,
      updateAggregateFields,
      handleEntryChange,
    ]
  );

  
  const handleExitPriceChangeWithDollar = useCallback(
    (index: number, price: number | undefined) => {
      if (useDollarValue && price && price > 0) {
        const exit = (data.exits || [])[index];
        const dollarValue = exit?.notional;
        if (dollarValue) {
          const calculatedSize = dollarValue / price;
          const roundedSize = parseFloat(calculatedSize.toFixed(sizePrecision));

          
          const exits = [...(data.exits || [])];
          exits[index] = {
            ...exits[index],
            price,
            size: roundedSize,
            notional: dollarValue,
          };
          onChange('exits', exits);
          updateAggregateFields(data.entries || [], exits);
          return;
        }
      }
      
      handleExitChange(index, 'price', price);
    },
    [
      useDollarValue,
      data.entries,
      data.exits,
      sizePrecision,
      onChange,
      updateAggregateFields,
      handleExitChange,
    ]
  );

  
  const getPositionSizeLabel = (): string => {
    switch (data.assetType) {
      case AssetType.STOCK:
        return t('form.field.position-size.shares');
      case AssetType.OPTIONS:
      case AssetType.FUTURES:
        return t('form.field.position-size.contracts');
      case AssetType.FOREX:
        return t('form.field.position-size.lots');
      case AssetType.CRYPTO:
        return t('form.field.position-size.amount');
      case AssetType.CFD:
        return t('form.field.position-size.cfd-units');
      default:
        return t('form.field.position-size');
    }
  };

  
  const totalEntrySize = (data.entries || []).reduce(
    (sum, entry) => sum + (entry.size || 0),
    0
  );
  const totalExitSize = (data.exits || []).reduce(
    (sum, exit) => sum + (exit.size || 0),
    0
  );
  const remainingSize = roundToPrecision(
    totalEntrySize - totalExitSize,
    sizePrecision
  );
  const totalDividends = (data.dividends || []).reduce(
    (sum, dividend) => sum + (dividend.amount || 0),
    0
  );

  
  useEffect(() => {
    
    return () => {};
  }, []);

  return {
    useDollarValue,
    pricePrecision,
    sizePrecision,
    supportsDividends,
    handleAddEntry,
    handleRemoveEntry,
    handleAddExit,
    handleRemoveExit,
    handleAddDividend,
    handleRemoveDividend,
    handleEntryChange,
    handleExitChange,
    handleDividendChange,
    handlePnLModeToggle,
    handleEntryDollarChange,
    handleExitDollarChange,
    handleEntryPriceChangeWithDollar,
    handleExitPriceChangeWithDollar,
    getPositionSizeLabel,
    blankTimeDefaultDate,
    totalEntrySize,
    remainingSize,
    totalDividends,
  };
}

const EntryExitFieldsComponent: React.FC<EntryExitFieldsProps> = ({
  data,
  errors,
  onChange,
}) => {
  const {
    useDollarValue,
    pricePrecision,
    sizePrecision,
    supportsDividends,
    handleAddEntry,
    handleRemoveEntry,
    handleAddExit,
    handleRemoveExit,
    handleAddDividend,
    handleRemoveDividend,
    handleEntryChange,
    handleExitChange,
    handleDividendChange,
    handlePnLModeToggle,
    handleEntryDollarChange,
    handleExitDollarChange,
    handleEntryPriceChangeWithDollar,
    handleExitPriceChangeWithDollar,
    getPositionSizeLabel,
    blankTimeDefaultDate,
    totalEntrySize,
    remainingSize,
    totalDividends,
  } = useEntryExitFieldsModel({ data, onChange });

  return (
    <>
      
      <PnLModeToggle
        useDirectPnLInput={data.useDirectPnLInput}
        onToggle={handlePnLModeToggle}
      />

      
      <DirectPnLSection data={data} errors={errors} onChange={onChange} />

      
      <EntriesSection
        data={data}
        errors={errors}
        useDollarValue={useDollarValue}
        pricePrecision={pricePrecision}
        sizePrecision={sizePrecision}
        totalEntrySize={totalEntrySize}
        blankTimeDefaultDate={blankTimeDefaultDate}
        getPositionSizeLabel={getPositionSizeLabel}
        onAddEntry={handleAddEntry}
        onRemoveEntry={handleRemoveEntry}
        onEntryChange={handleEntryChange}
        onEntryDollarChange={handleEntryDollarChange}
        onEntryPriceChangeWithDollar={handleEntryPriceChangeWithDollar}
      />

      
      <div className="exits-section">
        <h4 className="section-title">
          {t('form.field.exits')}{' '}
          {data.useDirectPnLInput ? t('form.field.optional') : ''}{' '}
          <span className="badge">{data.exits?.length || 0}</span>
        </h4>

        
        {(data.exits || []).map((exit, index) => (
          <div key={`exit-${index}`} className="exit-row">
            <div className="exit-index">{index + 1}</div>

            <div className="exit-fields">
              
              <div className="time-field-wrapper">
                <div className="time-field-header">
                  <label className="time-field-label">
                    {t('form.field.time')}
                    {!data.isMissedTrade && !data.useDirectPnLInput && (
                      <span className="required-star">*</span>
                    )}
                  </label>
                  {(data.exits?.length || 0) > 1 && (
                    <button
                      type="button"
                      className="remove-button-inline"
                      onClick={() => handleRemoveExit(index)}
                      aria-label={t('form.entry-exit.remove-exit')}
                    >
                      ×
                    </button>
                  )}
                </div>
                <FastDateTimeInput
                  value={exit.time}
                  onChange={(value) => handleExitChange(index, 'time', value)}
                  onBlankTimeDateChange={(date) =>
                    handleExitChange(index, 'blankTimeDate', date)
                  }
                  error={errors.exits?.[index]?.time}
                  includeTime={true}
                  defaultDateWhenEmpty={
                    exit.blankTimeDate ?? blankTimeDefaultDate
                  }
                  className="time-field"
                />
              </div>

              <NumberInput
                label={t('form.field.price')}
                value={exit.price}
                onChange={(value) =>
                  useDollarValue
                    ? handleExitPriceChangeWithDollar(index, value)
                    : handleExitChange(index, 'price', value)
                }
                error={errors.exits?.[index]?.price}
                min={0}
                precision={pricePrecision}
                allowDecimal={true}
                required={!data.isMissedTrade && !data.useDirectPnLInput}
                className="price-field"
              />

              {useDollarValue ? (
                <>
                  <NumberInput
                    label={t('form.field.value-dollar')}
                    value={
                      exit.notional ??
                      (exit.size && exit.price
                        ? exit.size * exit.price
                        : undefined)
                    }
                    onChange={(value) => handleExitDollarChange(index, value)}
                    error={errors.exits?.[index]?.size}
                    min={0}
                    precision={2}
                    allowDecimal={true}
                    required={!data.isMissedTrade && !data.useDirectPnLInput}
                    placeholder={t('form.field.dollar-amount-placeholder')}
                    className="size-field"
                  />
                  {exit.price > 0 && exit.size > 0 && (
                    <div className="calculated-size">
                      = {exit.size.toFixed(sizePrecision)}{' '}
                      {getPositionSizeLabel().toLowerCase()}
                    </div>
                  )}
                </>
              ) : (
                <NumberInput
                  label={getPositionSizeLabel()}
                  value={exit.size}
                  onChange={(value) => handleExitChange(index, 'size', value)}
                  error={errors.exits?.[index]?.size}
                  min={0}
                  precision={sizePrecision}
                  required={!data.isMissedTrade && !data.useDirectPnLInput}
                  className="size-field"
                />
              )}
            </div>
          </div>
        ))}

        
        <Button
          variant="outline"
          className="add-button clickable-icon"
          onClick={handleAddExit}
        >
          {t('form.entry-exit.add-exit')}
        </Button>

        
        <div
          className={`remaining-size ${remainingSize > 0 ? 'positive' : 'neutral'}`}
        >
          {t('form.entry-exit.remaining-position')}{' '}
          {remainingSize.toFixed(sizePrecision)}{' '}
          {remainingSize > 0
            ? t('form.entry-exit.open')
            : t('form.entry-exit.closed')}
        </div>
      </div>

      
      {supportsDividends && (
        <div className="dividends-section">
          <h4 className="section-title">
            {t('form.field.dividends')}{' '}
            <span className="badge">{data.dividends?.length || 0}</span>
          </h4>

          {(data.dividends || []).map((dividend, index) => (
            <div key={`dividend-${index}`} className="dividend-row">
              <div className="dividend-index">{index + 1}</div>

              <div className="dividend-fields">
                <div className="time-field-wrapper">
                  <div className="time-field-header">
                    <label className="time-field-label">
                      {t('form.field.time')}
                      <span className="required-star">*</span>
                    </label>
                    {(data.dividends?.length || 0) > 0 && (
                      <button
                        type="button"
                        className="remove-button-inline"
                        onClick={() => handleRemoveDividend(index)}
                        aria-label={t('form.dividends.remove-dividend')}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <FastDateTimeInput
                    value={dividend.time}
                    onChange={(value) =>
                      handleDividendChange(index, 'time', value)
                    }
                    error={errors.dividends?.[index]?.time}
                    includeTime={true}
                    className="time-field"
                  />
                </div>

                <NumberInput
                  label={t('form.field.dividend-amount')}
                  value={dividend.amount}
                  onChange={(value) =>
                    handleDividendChange(index, 'amount', value)
                  }
                  error={errors.dividends?.[index]?.amount}
                  precision={2}
                  allowDecimal={true}
                  required={true}
                  placeholder={t('form.placeholder.dividend-amount')}
                  className="amount-field"
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="add-button clickable-icon"
            onClick={handleAddDividend}
          >
            {t('form.dividends.add-dividend')}
          </Button>

          <div className="dividend-total">
            {t('form.dividends.total-dividends')} {totalDividends.toFixed(2)}
          </div>
        </div>
      )}

      
      {!data.useDirectPnLInput && errors.entriesExits && (
        <div className="errorMessage" role="alert">
          {errors.entriesExits}
        </div>
      )}
    </>
  );
};

export const EntryExitFields = React.memo(EntryExitFieldsComponent);
