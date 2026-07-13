

import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { NumberInput, FastDateTimeInput } from '../../../core';
import { Button } from '../../../ui/Button';
import { Tooltip } from '../../../shared/Tooltip';
import { Info } from '../../../shared/icons/ObsidianIcon';
import ToggleSwitch from '../../../ui/ToggleSwitch';
import {
  AssetType,
  DividendTransaction,
  EntryTransaction,
  ExitTransaction,
  IdealExitTransaction,
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
import { TradeFormInputMode } from '../../../../settings/types';

type TransactionFieldValue = number | Date | string | undefined | boolean;
type IdealExitFieldValue = number | string | undefined;

let nextTransactionRowKey = 0;

const createTransactionRowKey = (prefix: string): string =>
  `${prefix}-${nextTransactionRowKey++}`;

const getTransactionRowKeys = (
  keys: string[],
  prefix: string,
  count: number
): string[] => {
  while (keys.length < count) {
    keys.push(createTransactionRowKey(prefix));
  }
  if (keys.length > count) {
    keys.length = count;
  }
  return keys;
};

const normalizeTransactionFieldValue = (
  field: string,
  value: TransactionFieldValue
): TransactionFieldValue => {
  if (field !== 'time' || typeof value !== 'string') {
    return value;
  }

  const parsedDate = new Date(value);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

const toOptionalTransactionNumber = (
  value: TransactionFieldValue
): number | undefined => {
  if (value === undefined || value === '') return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const toOptionalIdealExitNumber = (
  value: IdealExitFieldValue
): number | undefined => {
  if (value === undefined || value === '' || Array.isArray(value)) {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const hasPersistableIdealExitPrice = (exit: IdealExitTransaction): boolean =>
  exit.price !== undefined && exit.price > 0;

const hasCopyableActualExitValues = (exit: ExitTransaction): boolean =>
  exit.price !== undefined &&
  exit.price > 0 &&
  exit.size !== undefined &&
  exit.size > 0;

interface EntryExitFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  
  inputMode: TradeFormInputMode;
  
  showIdealExits?: boolean;
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

function DirectPnLSection({
  data,
  errors,
  onChange,
  inputMode,
}: EntryExitFieldsProps) {
  if (!data.useDirectPnLInput) return null;

  return (
    <div className="journalit-direct-pnl-section">
      {inputMode === 'pnl-risk' && (
        <div className="field journalit-direct-pnl-time-field">
          <FastDateTimeInput
            label={t('form.layout.entry-time')}
            value={data.entryTime}
            onChange={(value) => onChange('entryTime', value)}
            error={errors.entryTime}
            includeTime={true}
            className="journalit-direct-pnl-time-input"
          />
        </div>
      )}
      <div className="field journalit-direct-pnl-value-field">
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
  entryRowKeys: string[];
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
  entryRowKeys,
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
        <div key={entryRowKeys[index]} className="entry-row">
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
                {entry.price !== undefined &&
                  entry.size !== undefined &&
                  entry.price > 0 &&
                  entry.size > 0 && (
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
  const entryRowKeysRef = useRef<string[]>([]);
  const exitRowKeysRef = useRef<string[]>([]);
  const idealExitRowKeysRef = useRef<string[]>([]);
  const dividendRowKeysRef = useRef<string[]>([]);

  
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
    entryRowKeysRef.current.splice(index, 1);
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
    exitRowKeysRef.current.splice(index, 1);
    onChange('exits', exits);

    
    updateAggregateFields(data.entries || [], exits);
  };

  const handleAddIdealExit = () => {
    const currentActualExit = (data.exits || [])[data.idealExits?.length || 0];
    const defaultSize =
      currentActualExit?.size !== undefined && currentActualExit.size > 0
        ? currentActualExit.size
        : undefined;
    const idealExits = [
      ...(data.idealExits || []),
      {
        price: undefined,
        size: defaultSize,
      },
    ];
    onChange('idealExits', idealExits);
  };

  const handleCopyActualExitsToIdeal = () => {
    const idealExits = (data.exits || []).flatMap((exit) =>
      hasCopyableActualExitValues(exit)
        ? [
            {
              price: exit.price,
              size: exit.size,
            },
          ]
        : []
    );
    if (idealExits.length === 0) {
      return;
    }
    onChange('idealExits', idealExits);
  };

  const handleRemoveIdealExit = (index: number) => {
    const idealExits = [...(data.idealExits || [])];
    idealExits.splice(index, 1);
    idealExitRowKeysRef.current.splice(index, 1);
    onChange('idealExits', idealExits);
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
    dividendRowKeysRef.current.splice(index, 1);
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
    (
      index: number,
      field: keyof EntryTransaction,
      rawValue: TransactionFieldValue
    ) => {
      const entries = [...(data.entries || [])];
      const value = normalizeTransactionFieldValue(field, rawValue);

      
      if (field === 'size') {
        entries[index] = {
          ...entries[index],
          [field]: toOptionalTransactionNumber(value),
          notional: undefined,
        };
      } else if (field === 'time') {
        entries[index] = {
          ...entries[index],
          time: value instanceof Date ? value : undefined,
          blankTimeDate: value ? undefined : entries[index]?.blankTimeDate,
        };
      } else if (field === 'blankTimeDate') {
        entries[index] = {
          ...entries[index],
          time: undefined,
          blankTimeDate: value instanceof Date ? value : undefined,
        };
      } else {
        entries[index] = {
          ...entries[index],
          [field]: toOptionalTransactionNumber(value),
        };
      }
      onChange('entries', entries);

      
      updateAggregateFields(entries, data.exits || []);
    },
    [data.entries, data.exits, onChange, updateAggregateFields]
  );

  
  const handleExitChange = useCallback(
    (
      index: number,
      field: keyof ExitTransaction,
      rawValue: TransactionFieldValue
    ) => {
      const exits = [...(data.exits || [])];
      const value = normalizeTransactionFieldValue(field, rawValue);

      
      if (field === 'size') {
        exits[index] = {
          ...exits[index],
          [field]: toOptionalTransactionNumber(value),
          notional: undefined,
        };
      } else if (field === 'time') {
        exits[index] = {
          ...exits[index],
          time: value instanceof Date ? value : undefined,
          blankTimeDate: value ? undefined : exits[index]?.blankTimeDate,
        };
      } else if (field === 'blankTimeDate') {
        exits[index] = {
          ...exits[index],
          time: undefined,
          blankTimeDate: value instanceof Date ? value : undefined,
        };
      } else if (field === 'hasExplicitPrice') {
        exits[index] = { ...exits[index], hasExplicitPrice: Boolean(value) };
      } else {
        exits[index] = {
          ...exits[index],
          [field]: toOptionalTransactionNumber(value),
        };
      }
      onChange('exits', exits);

      
      updateAggregateFields(data.entries || [], exits);
    },
    [data.entries, data.exits, onChange, updateAggregateFields]
  );

  const handleDividendChange = useCallback(
    (
      index: number,
      field: keyof DividendTransaction,
      rawValue: TransactionFieldValue
    ) => {
      const dividends = [...(data.dividends || [])];
      const value = normalizeTransactionFieldValue(field, rawValue);

      dividends[index] = {
        ...dividends[index],
        [field]:
          field === 'time' && value instanceof Date
            ? value
            : toOptionalTransactionNumber(value),
      };
      onChange('dividends', dividends);
    },
    [data.dividends, onChange]
  );

  const handleIdealExitChange = useCallback(
    (
      index: number,
      field: keyof IdealExitTransaction,
      value: IdealExitFieldValue
    ) => {
      const idealExits = [...(data.idealExits || [])];
      const existing = idealExits[index] || {};

      if (field === 'price' || field === 'size') {
        idealExits[index] = {
          ...existing,
          [field]: toOptionalIdealExitNumber(value),
        };
      }

      onChange('idealExits', idealExits);
    },
    [data.idealExits, onChange]
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
  const totalIdealExitSize = (data.idealExits || []).reduce(
    (sum, exit) =>
      hasPersistableIdealExitPrice(exit) &&
      exit.size !== undefined &&
      exit.size > 0
        ? sum + exit.size
        : sum,
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
  const entryRowKeys = getTransactionRowKeys(
    entryRowKeysRef.current,
    'entry',
    data.entries?.length || 0
  );
  const exitRowKeys = getTransactionRowKeys(
    exitRowKeysRef.current,
    'exit',
    data.exits?.length || 0
  );
  const idealExitRowKeys = getTransactionRowKeys(
    idealExitRowKeysRef.current,
    'ideal-exit',
    data.idealExits?.length || 0
  );
  const dividendRowKeys = getTransactionRowKeys(
    dividendRowKeysRef.current,
    'dividend',
    data.dividends?.length || 0
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
    handleAddIdealExit,
    handleCopyActualExitsToIdeal,
    handleRemoveIdealExit,
    handleAddDividend,
    handleRemoveDividend,
    handleEntryChange,
    handleExitChange,
    handleIdealExitChange,
    handleDividendChange,
    handlePnLModeToggle,
    handleEntryDollarChange,
    handleExitDollarChange,
    handleEntryPriceChangeWithDollar,
    handleExitPriceChangeWithDollar,
    getPositionSizeLabel,
    blankTimeDefaultDate,
    entryRowKeys,
    exitRowKeys,
    idealExitRowKeys,
    dividendRowKeys,
    totalEntrySize,
    remainingSize,
    totalIdealExitSize,
    totalDividends,
  };
}

interface IdealExitsSectionProps {
  idealExits: IdealExitTransaction[];
  idealExitRowKeys: string[];
  pricePrecision: number;
  sizePrecision: number;
  totalEntrySize: number;
  totalIdealExitSize: number;
  onAddIdealExit: () => void;
  onCopyActualExitsToIdeal: () => void;
  onRemoveIdealExit: (index: number) => void;
  onIdealExitChange: (
    index: number,
    field: keyof IdealExitTransaction,
    value: IdealExitFieldValue
  ) => void;
}

function IdealExitsSection({
  idealExits,
  idealExitRowKeys,
  pricePrecision,
  sizePrecision,
  totalEntrySize,
  totalIdealExitSize,
  onAddIdealExit,
  onCopyActualExitsToIdeal,
  onRemoveIdealExit,
  onIdealExitChange,
}: IdealExitsSectionProps) {
  const persistableIdealExits = idealExits.filter(hasPersistableIdealExitPrice);
  const hasEntrySize = totalEntrySize > 0;
  const roundedIdealExitSize = roundToPrecision(
    totalIdealExitSize,
    sizePrecision
  );
  const roundedEntrySize = roundToPrecision(totalEntrySize, sizePrecision);
  const showCoverage =
    persistableIdealExits.length > 0 &&
    hasEntrySize &&
    roundedIdealExitSize !== roundedEntrySize;

  return (
    <div className="journalit-ideal-exits">
      <div className="journalit-ideal-exits__header">
        <div className="journalit-ideal-exits__title-group">
          <div className="journalit-ideal-exits__title">
            {t('form.ideal-exit.title')}{' '}
            <span className="journalit-ideal-exits__optional-text">
              {t('form.field.optional')}
            </span>
          </div>
          <Tooltip
            content={t('form.ideal-exit.tooltip')}
            className="trade-form-input-mode-tooltip"
            triggerClassName="journalit-trade-form-layout-editor__mode-info-trigger"
            preferredPosition="top"
          >
            <span
              className="journalit-dashboard-metric-info journalit-trade-form-layout-editor__mode-info journalit-ideal-exits__info"
              aria-label={t('form.ideal-exit.title')}
            >
              <Info size={10} aria-hidden="true" />
            </span>
          </Tooltip>
        </div>
        <div className="journalit-ideal-exits__header-actions">
          {showCoverage && (
            <div className="journalit-ideal-exits__coverage">
              {totalIdealExitSize.toFixed(sizePrecision)} /{' '}
              {totalEntrySize.toFixed(sizePrecision)}
            </div>
          )}
          <Button
            variant="plain"
            size="small"
            className="journalit-ideal-exits__add-button"
            onClick={onAddIdealExit}
          >
            + {t('button.add')}
          </Button>
        </div>
      </div>

      {idealExits.length === 0 && (
        <div className="journalit-ideal-exits__empty-state">
          <span>{t('form.ideal-exit.empty')}</span>
          {hasEntrySize ? (
            <Button
              variant="plain"
              size="small"
              className="journalit-ideal-exits__copy-button"
              onClick={onCopyActualExitsToIdeal}
            >
              {t('form.ideal-exit.copy-actual')}
            </Button>
          ) : null}
        </div>
      )}

      {idealExits.length > 0 && (
        <div className="journalit-ideal-exit-row journalit-ideal-exit-row--header">
          <span aria-hidden="true" />
          <span>{t('form.ideal-exit.price')}</span>
          <span>{t('form.ideal-exit.size')}</span>
          <span aria-hidden="true" />
        </div>
      )}

      {idealExits.map((idealExit, index) => (
        <div key={idealExitRowKeys[index]} className="journalit-ideal-exit-row">
          <span className="journalit-ideal-exit-index-label">{index + 1}</span>
          <div className="journalit-ideal-exit-field">
            <span className="journalit-ideal-exit-field-label">
              {t('form.ideal-exit.price')}
            </span>
            <NumberInput
              aria-label={`${t('form.ideal-exit.price')} ${index + 1}`}
              value={idealExit.price}
              onChange={(value) => onIdealExitChange(index, 'price', value)}
              min={0}
              precision={pricePrecision}
              allowDecimal={true}
              placeholder="112.00"
            />
          </div>
          <div className="journalit-ideal-exit-field">
            <span className="journalit-ideal-exit-field-label">
              {t('form.ideal-exit.size')}
            </span>
            <NumberInput
              aria-label={`${t('form.ideal-exit.size')} ${index + 1}`}
              value={idealExit.size}
              onChange={(value) => onIdealExitChange(index, 'size', value)}
              min={0}
              precision={sizePrecision}
              allowDecimal={true}
              placeholder="100"
            />
          </div>
          <Button
            type="button"
            variant="plain"
            size="small"
            className="journalit-ideal-exit-remove-button"
            onClick={() => onRemoveIdealExit(index)}
            aria-label={t('form.ideal-exit.remove')}
          >
            ×
          </Button>
        </div>
      ))}

      {idealExits.length > 0 && hasEntrySize && (
        <div className="journalit-ideal-exits__actions">
          <Button
            variant="plain"
            size="small"
            className="journalit-ideal-exits__copy-button"
            onClick={onCopyActualExitsToIdeal}
          >
            {t('form.ideal-exit.copy-actual')}
          </Button>
        </div>
      )}
    </div>
  );
}

interface ExitsSectionProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  useDollarValue: boolean;
  pricePrecision: number;
  sizePrecision: number;
  showIdealExits: boolean;
  totalEntrySize: number;
  remainingSize: number;
  totalIdealExitSize: number;
  exitRowKeys: string[];
  idealExitRowKeys: string[];
  blankTimeDefaultDate: Date;
  getPositionSizeLabel: () => string;
  onAddExit: () => void;
  onRemoveExit: (index: number) => void;
  onExitChange: (
    index: number,
    field: keyof ExitTransaction,
    value: TransactionFieldValue
  ) => void;
  onExitDollarChange: (index: number, value: number | undefined) => void;
  onExitPriceChangeWithDollar: (
    index: number,
    value: number | undefined
  ) => void;
  onAddIdealExit: () => void;
  onCopyActualExitsToIdeal: () => void;
  onRemoveIdealExit: (index: number) => void;
  onIdealExitChange: (
    index: number,
    field: keyof IdealExitTransaction,
    value: IdealExitFieldValue
  ) => void;
}

function ExitsSection({
  data,
  errors,
  useDollarValue,
  pricePrecision,
  sizePrecision,
  showIdealExits,
  totalEntrySize,
  remainingSize,
  totalIdealExitSize,
  exitRowKeys,
  idealExitRowKeys,
  blankTimeDefaultDate,
  getPositionSizeLabel,
  onAddExit,
  onRemoveExit,
  onExitChange,
  onExitDollarChange,
  onExitPriceChangeWithDollar,
  onAddIdealExit,
  onCopyActualExitsToIdeal,
  onRemoveIdealExit,
  onIdealExitChange,
}: ExitsSectionProps) {
  return (
    <div className="exits-section">
      <h4 className="section-title">
        {t('form.field.exits')}{' '}
        {data.useDirectPnLInput ? t('form.field.optional') : ''}{' '}
        <span className="badge">{data.exits?.length || 0}</span>
      </h4>

      
      {(data.exits || []).map((exit, index) => (
        <div key={exitRowKeys[index]} className="exit-row">
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
                    onClick={() => onRemoveExit(index)}
                    aria-label={t('form.entry-exit.remove-exit')}
                  >
                    ×
                  </button>
                )}
              </div>
              <FastDateTimeInput
                value={exit.time}
                onChange={(value) => onExitChange(index, 'time', value)}
                onBlankTimeDateChange={(date) =>
                  onExitChange(index, 'blankTimeDate', date)
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
                  ? onExitPriceChangeWithDollar(index, value)
                  : onExitChange(index, 'price', value)
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
                  onChange={(value) => onExitDollarChange(index, value)}
                  error={errors.exits?.[index]?.size}
                  min={0}
                  precision={2}
                  allowDecimal={true}
                  required={!data.isMissedTrade && !data.useDirectPnLInput}
                  placeholder={t('form.field.dollar-amount-placeholder')}
                  className="size-field"
                />
                {exit.price !== undefined &&
                  exit.size !== undefined &&
                  exit.price > 0 &&
                  exit.size > 0 && (
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
                onChange={(value) => onExitChange(index, 'size', value)}
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
        onClick={() => void onAddExit()}
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

      {showIdealExits && (
        <IdealExitsSection
          idealExits={data.idealExits || []}
          idealExitRowKeys={idealExitRowKeys}
          pricePrecision={pricePrecision}
          sizePrecision={sizePrecision}
          totalEntrySize={totalEntrySize}
          totalIdealExitSize={totalIdealExitSize}
          onAddIdealExit={onAddIdealExit}
          onCopyActualExitsToIdeal={onCopyActualExitsToIdeal}
          onRemoveIdealExit={onRemoveIdealExit}
          onIdealExitChange={onIdealExitChange}
        />
      )}
    </div>
  );
}

const EntryExitFieldsComponent: React.FC<EntryExitFieldsProps> = ({
  data,
  errors,
  onChange,
  inputMode,
  showIdealExits = true,
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
    handleAddIdealExit,
    handleCopyActualExitsToIdeal,
    handleRemoveIdealExit,
    handleAddDividend,
    handleRemoveDividend,
    handleEntryChange,
    handleExitChange,
    handleIdealExitChange,
    handleDividendChange,
    handlePnLModeToggle,
    handleEntryDollarChange,
    handleExitDollarChange,
    handleEntryPriceChangeWithDollar,
    handleExitPriceChangeWithDollar,
    getPositionSizeLabel,
    blankTimeDefaultDate,
    entryRowKeys,
    exitRowKeys,
    idealExitRowKeys,
    dividendRowKeys,
    totalEntrySize,
    remainingSize,
    totalIdealExitSize,
    totalDividends,
  } = useEntryExitFieldsModel({ data, onChange });

  const showPriceExecutionFields = inputMode !== 'pnl-risk';
  const hasDividendRows = (data.dividends?.length ?? 0) > 0;
  const showDividendsSection =
    supportsDividends &&
    (showPriceExecutionFields || hasDividendRows || Boolean(errors.dividends));

  return (
    <>
      
      {showPriceExecutionFields && (
        <PnLModeToggle
          useDirectPnLInput={data.useDirectPnLInput}
          onToggle={(value) => void handlePnLModeToggle(value)}
        />
      )}

      
      <DirectPnLSection
        data={data}
        errors={errors}
        onChange={onChange}
        inputMode={inputMode}
      />

      
      {showPriceExecutionFields && (
        <EntriesSection
          data={data}
          errors={errors}
          useDollarValue={useDollarValue}
          pricePrecision={pricePrecision}
          sizePrecision={sizePrecision}
          totalEntrySize={totalEntrySize}
          entryRowKeys={entryRowKeys}
          blankTimeDefaultDate={blankTimeDefaultDate}
          getPositionSizeLabel={getPositionSizeLabel}
          onAddEntry={handleAddEntry}
          onRemoveEntry={handleRemoveEntry}
          onEntryChange={handleEntryChange}
          onEntryDollarChange={handleEntryDollarChange}
          onEntryPriceChangeWithDollar={handleEntryPriceChangeWithDollar}
        />
      )}

      
      {showPriceExecutionFields && (
        <ExitsSection
          data={data}
          errors={errors}
          useDollarValue={useDollarValue}
          pricePrecision={pricePrecision}
          sizePrecision={sizePrecision}
          showIdealExits={showIdealExits}
          totalEntrySize={totalEntrySize}
          remainingSize={remainingSize}
          totalIdealExitSize={totalIdealExitSize}
          exitRowKeys={exitRowKeys}
          idealExitRowKeys={idealExitRowKeys}
          blankTimeDefaultDate={blankTimeDefaultDate}
          getPositionSizeLabel={getPositionSizeLabel}
          onAddExit={handleAddExit}
          onRemoveExit={handleRemoveExit}
          onExitChange={handleExitChange}
          onExitDollarChange={handleExitDollarChange}
          onExitPriceChangeWithDollar={handleExitPriceChangeWithDollar}
          onAddIdealExit={handleAddIdealExit}
          onCopyActualExitsToIdeal={handleCopyActualExitsToIdeal}
          onRemoveIdealExit={handleRemoveIdealExit}
          onIdealExitChange={handleIdealExitChange}
        />
      )}

      
      {showDividendsSection && (
        <div className="dividends-section">
          <h4 className="section-title">
            {t('form.field.dividends')}{' '}
            <span className="badge">{data.dividends?.length || 0}</span>
          </h4>

          {(data.dividends || []).map((dividend, index) => (
            <div key={dividendRowKeys[index]} className="dividend-row">
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
            onClick={() => void handleAddDividend()}
          >
            {t('form.dividends.add-dividend')}
          </Button>

          <div className="dividend-total">
            {t('form.dividends.total-dividends')} {totalDividends.toFixed(2)}
          </div>
        </div>
      )}

      
      {showPriceExecutionFields &&
        !data.useDirectPnLInput &&
        errors.entriesExits && (
          <div className="errorMessage" role="alert">
            {errors.entriesExits}
          </div>
        )}
    </>
  );
};

export const EntryExitFields = React.memo(EntryExitFieldsComponent);
