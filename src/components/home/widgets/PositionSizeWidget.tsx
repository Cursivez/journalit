

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Save, RotateCcw, ChevronDown } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  FUTURES_SPECS,
  FOREX_SPECS,
  FuturesSpec,
  ForexSpec,
} from '../../../data/instrumentSpecs';
import { PositionSizeAssetType } from '../../../settings/types';
import { getSizePrecision } from '../../forms/trade/utils';
import { hasTranslation, t } from '../../../lang/helpers';

interface PositionSizeWidgetProps {
  plugin: JournalitPlugin;
  autoFocusOnMount?: boolean;
}

type AssetTab = {
  id: PositionSizeAssetType;
  label: string;
};

interface StockCalculationResult {
  positionSize: number;
  unit: 'shares';
  dollarAmount: number | null;
  priceDiff: number | null;
  isLong: boolean | null;
  riskRewardRatio: number | null;
  potentialProfit: number | null;
}

interface FuturesCalculationResult {
  positionSize: number;
  unit: 'contracts';
  pointsDiff: number;
  ticksDiff: number;
  riskPerContract: number;
  isLong: boolean;
  riskRewardRatio: number | null;
  potentialProfit: number | null;
}

interface ForexCalculationResult {
  positionSize: number;
  unit: 'lots';
  standardLots: number;
  miniLots: number;
  microLots: number;
  pips: number;
  riskPerLot: number;
  riskRewardRatio: number | null;
  potentialProfit: number | null;
}


const FUTURES_OPTIONS = Object.entries(FUTURES_SPECS)
  .map(([symbol, spec]) => ({ symbol, name: spec.name }))
  .sort((a, b) => a.symbol.localeCompare(b.symbol));


const FOREX_OPTIONS = Object.entries(FOREX_SPECS)
  .map(([symbol, spec]) => ({ symbol, name: spec.name }))
  .sort((a, b) => a.symbol.localeCompare(b.symbol));

const MIN_RISK_PERCENT = 0.1;
const MAX_RISK_PERCENT = 100;
const DEFAULT_RISK_PERCENT = 1;

const formatRiskPercentInput = (value: number | null | undefined): string => {
  return typeof value === 'number' && Number.isFinite(value)
    ? String(value)
    : String(DEFAULT_RISK_PERCENT);
};

const isAllowedRiskPercentInput = (value: string): boolean => {
  return /^(?:\d+(?:[.,]\d*)?|[.,]\d*)?$/.test(value);
};

export const parseRiskPercentInput = (value: string): number | null => {
  const normalized = value.trim().replace(',', '.');

  if (normalized === '' || normalized === '.') {
    return null;
  }

  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const clampRiskPercent = (value: number): number => {
  return Math.min(MAX_RISK_PERCENT, Math.max(MIN_RISK_PERCENT, value));
};



const useStockCalculation = (
  entryPrice: string,
  stopLoss: string,
  stockProfitTarget: string,
  riskAmount: number,
  useDollarValue: boolean,
  stockDollarValue: string
): StockCalculationResult | null => {
  return useMemo(() => {
    const entry = parseFloat(entryPrice) || 0;

    
    if (useDollarValue) {
      const dollarAmount = parseFloat(stockDollarValue) || 0;
      if (entry <= 0 || dollarAmount <= 0) return null;

      const shares = dollarAmount / entry;
      const roundedShares = parseFloat(
        shares.toFixed(getSizePrecision('stock'))
      );

      return {
        positionSize: roundedShares,
        unit: 'shares',
        dollarAmount,
        priceDiff: null,
        isLong: null,
        riskRewardRatio: null,
        potentialProfit: null,
      };
    }

    
    const stop = parseFloat(stopLoss) || 0;
    if (entry <= 0 || stop <= 0) return null;

    const priceDiff = Math.abs(entry - stop);
    if (priceDiff === 0) return null;

    const shares = riskAmount / priceDiff;
    const isLong = entry > stop;

    
    const target = parseFloat(stockProfitTarget) || 0;
    let riskRewardRatio: number | null = null;
    let potentialProfit: number | null = null;
    if (target > 0) {
      const rewardDiff = Math.abs(target - entry);
      riskRewardRatio = rewardDiff / priceDiff;
      potentialProfit = rewardDiff * shares;
    }

    return {
      positionSize: shares,
      unit: 'shares',
      dollarAmount: null,
      priceDiff,
      isLong,
      riskRewardRatio,
      potentialProfit,
    };
  }, [
    entryPrice,
    stopLoss,
    stockProfitTarget,
    riskAmount,
    useDollarValue,
    stockDollarValue,
  ]);
};

const useFuturesCalculation = (
  futuresEntry: string,
  futuresStop: string,
  futuresProfitTarget: string,
  riskAmount: number,
  futuresSpec: FuturesSpec | undefined
): FuturesCalculationResult | null => {
  return useMemo(() => {
    if (!futuresSpec) return null;

    const entry = parseFloat(futuresEntry) || 0;
    const stop = parseFloat(futuresStop) || 0;
    if (entry <= 0 || stop <= 0) return null;

    const pointsDiff = Math.abs(entry - stop);
    if (pointsDiff === 0) return null;

    
    const riskPerContract = pointsDiff * futuresSpec.dollarPerPoint;
    const contracts = riskAmount / riskPerContract;
    const isLong = entry > stop;

    
    const ticksDiff = pointsDiff / futuresSpec.tickSize;

    
    const target = parseFloat(futuresProfitTarget) || 0;
    let riskRewardRatio: number | null = null;
    let potentialProfit: number | null = null;
    if (target > 0) {
      const rewardPointsDiff = Math.abs(target - entry);
      riskRewardRatio = rewardPointsDiff / pointsDiff;
      potentialProfit =
        rewardPointsDiff * futuresSpec.dollarPerPoint * contracts;
    }

    return {
      positionSize: contracts,
      unit: 'contracts',
      pointsDiff,
      ticksDiff,
      riskPerContract,
      isLong,
      riskRewardRatio,
      potentialProfit,
    };
  }, [futuresEntry, futuresStop, futuresProfitTarget, riskAmount, futuresSpec]);
};

const useForexCalculation = (
  forexStopPips: string,
  forexProfitTargetPips: string,
  riskAmount: number,
  forexSpec: ForexSpec | undefined
): ForexCalculationResult | null => {
  return useMemo(() => {
    if (!forexSpec) return null;

    const pips = parseFloat(forexStopPips) || 0;
    if (pips <= 0) return null;

    
    const riskPerLot = pips * forexSpec.pipValue;
    const lots = riskAmount / riskPerLot;

    
    const targetPips = parseFloat(forexProfitTargetPips) || 0;
    let riskRewardRatio: number | null = null;
    let potentialProfit: number | null = null;
    if (targetPips > 0) {
      riskRewardRatio = targetPips / pips;
      potentialProfit = targetPips * forexSpec.pipValue * lots;
    }

    return {
      positionSize: lots,
      unit: 'lots',
      standardLots: lots,
      miniLots: lots * 10,
      microLots: lots * 100,
      pips,
      riskPerLot,
      riskRewardRatio,
      potentialProfit,
    };
  }, [forexStopPips, forexProfitTargetPips, riskAmount, forexSpec]);
};



interface HeaderProps {
  onSaveDefaults: () => void;
  onReset: () => void;
}

const PositionSizeHeader: React.FC<HeaderProps> = ({
  onSaveDefaults,
  onReset,
}) => {
  return (
    <div className="journalit-home-position__header">
      <div className="journalit-home-widget__eyebrow">
        {t('widget.position-size.title')}
      </div>
      <div className="journalit-home-position__actions">
        <button
          onClick={onSaveDefaults}
          className="clickable-icon journalit-home-position__action-button"
          aria-label={t('widget.position-size.save-defaults')}
        >
          <Save size={12} />
        </button>
        <button
          onClick={onReset}
          className="clickable-icon journalit-home-position__action-button"
          aria-label={t('widget.position-size.reset-defaults')}
        >
          <RotateCcw size={12} />
        </button>
      </div>
    </div>
  );
};

interface TabsProps {
  assetTabs: AssetTab[];
  assetType: PositionSizeAssetType;
  onAssetTypeChange: (type: PositionSizeAssetType) => void;
}

const PositionSizeTabs: React.FC<TabsProps> = ({
  assetTabs,
  assetType,
  onAssetTypeChange,
}) => {
  return (
    <div className="journalit-home-position__tabs">
      {assetTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onAssetTypeChange(tab.id)}
          className={`journalit-home-position__tab ${assetType === tab.id ? 'journalit-home-position__tab--active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface CommonInputsProps {
  accountBalance: number;
  onAccountBalanceChange: (value: number) => void;
  riskPercentInput: string;
  onRiskPercentInputChange: (value: string) => void;
  onRiskPercentBlur: () => void;
  parsedRiskPercent: number | null;
}

const CommonInputs: React.FC<CommonInputsProps> = ({
  accountBalance,
  onAccountBalanceChange,
  riskPercentInput,
  onRiskPercentInputChange,
  onRiskPercentBlur,
  parsedRiskPercent,
}) => {
  return (
    <div className="journalit-home-position__grid">
      <label className="journalit-home-position__label">
        {t('widget.position-size.account-balance')}
        <input
          type="number"
          value={accountBalance}
          onChange={(e) =>
            onAccountBalanceChange(parseFloat(e.target.value) || 0)
          }
          className="journalit-home-position__input"
        />
      </label>
      <label className="journalit-home-position__label">
        {t('widget.position-size.risk-percent')}
        <input
          type="text"
          inputMode="decimal"
          value={riskPercentInput}
          onChange={(e) => {
            const nextValue = e.currentTarget.value;
            if (isAllowedRiskPercentInput(nextValue)) {
              onRiskPercentInputChange(nextValue);
            }
          }}
          onBlur={onRiskPercentBlur}
          aria-invalid={
            parsedRiskPercent !== null &&
            (parsedRiskPercent < MIN_RISK_PERCENT ||
              parsedRiskPercent > MAX_RISK_PERCENT)
          }
          className="journalit-home-position__input"
        />
      </label>
    </div>
  );
};

interface StockInputsProps {
  useDollarValue: boolean;
  entryPrice: string;
  onEntryPriceChange: (value: string) => void;
  stockEntryInputRef: React.RefObject<HTMLInputElement | null>;
  stopLoss: string;
  onStopLossChange: (value: string) => void;
  stockProfitTarget: string;
  onStockProfitTargetChange: (value: string) => void;
  stockDollarValue: string;
  onStockDollarValueChange: (value: string) => void;
}

const StockInputs: React.FC<StockInputsProps> = ({
  useDollarValue,
  entryPrice,
  onEntryPriceChange,
  stockEntryInputRef,
  stopLoss,
  onStopLossChange,
  stockProfitTarget,
  onStockProfitTargetChange,
  stockDollarValue,
  onStockDollarValueChange,
}) => {
  return (
    <>
      {useDollarValue ? (
        
        <div className="journalit-home-position__grid">
          <label className="journalit-home-position__label">
            {t('widget.position-size.entry-price')}
            <input
              ref={stockEntryInputRef}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={entryPrice}
              onChange={(e) => onEntryPriceChange(e.target.value)}
              className="journalit-home-position__input"
            />
          </label>
          <label className="journalit-home-position__label">
            {t('widget.position-size.investment-dollar')}
            <input
              type="number"
              step="100"
              placeholder={t('widget.position-size.placeholder.example', {
                value: '10000',
              })}
              value={stockDollarValue}
              onChange={(e) => onStockDollarValueChange(e.target.value)}
              className="journalit-home-position__input"
            />
          </label>
        </div>
      ) : (
        
        <>
          <div className="journalit-home-position__grid">
            <label className="journalit-home-position__label">
              {t('widget.position-size.entry-price')}
              <input
                ref={stockEntryInputRef}
                type="number"
                step="0.01"
                placeholder="0.00"
                value={entryPrice}
                onChange={(e) => onEntryPriceChange(e.target.value)}
                className="journalit-home-position__input"
              />
            </label>
            <label className="journalit-home-position__label">
              {t('form.field.stop-loss')}
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={stopLoss}
                onChange={(e) => onStopLossChange(e.target.value)}
                className="journalit-home-position__input"
              />
            </label>
          </div>
          <label className="journalit-home-position__label">
            {t('widget.position-size.profit-target-optional')}
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={stockProfitTarget}
              onChange={(e) => onStockProfitTargetChange(e.target.value)}
              className="journalit-home-position__input"
            />
          </label>
        </>
      )}
    </>
  );
};

interface FuturesInputsProps {
  futuresSymbol: string;
  onFuturesSymbolChange: (value: string) => void;
  futuresSpec: FuturesSpec | undefined;
  futuresEntry: string;
  onFuturesEntryChange: (value: string) => void;
  futuresEntryInputRef: React.RefObject<HTMLInputElement | null>;
  futuresStop: string;
  onFuturesStopChange: (value: string) => void;
  futuresProfitTarget: string;
  onFuturesProfitTargetChange: (value: string) => void;
}

const FuturesInputs: React.FC<FuturesInputsProps> = ({
  futuresSymbol,
  onFuturesSymbolChange,
  futuresSpec,
  futuresEntry,
  onFuturesEntryChange,
  futuresEntryInputRef,
  futuresStop,
  onFuturesStopChange,
  futuresProfitTarget,
  onFuturesProfitTargetChange,
}) => {
  return (
    <>
      <div className="journalit-home-position__select-wrapper">
        <label className="journalit-home-position__label">
          {t('form.field.instrument')}
          <select
            value={futuresSymbol}
            onChange={(e) => onFuturesSymbolChange(e.target.value)}
            className="journalit-home-position__select"
          >
            {FUTURES_OPTIONS.map((opt) => (
              <option key={opt.symbol} value={opt.symbol}>
                {opt.symbol} - {opt.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="journalit-home-position__select-icon"
          />
        </label>
      </div>
      {futuresSpec && (
        <div className="journalit-home-position__spec-info">
          {t('widget.position-size.futures-info', {
            dollar: futuresSpec.dollarPerPoint.toString(),
            size: futuresSpec.tickSize.toString(),
            value: futuresSpec.tickValue.toString(),
          })}
        </div>
      )}
      <div className="journalit-home-position__grid">
        <label className="journalit-home-position__label">
          {t('widget.position-size.entry-price')}
          <input
            ref={futuresEntryInputRef}
            type="number"
            step={futuresSpec?.tickSize || 0.01}
            placeholder="0.00"
            value={futuresEntry}
            onChange={(e) => onFuturesEntryChange(e.target.value)}
            className="journalit-home-position__input"
          />
        </label>
        <label className="journalit-home-position__label">
          {t('form.field.stop-loss')}
          <input
            type="number"
            step={futuresSpec?.tickSize || 0.01}
            placeholder="0.00"
            value={futuresStop}
            onChange={(e) => onFuturesStopChange(e.target.value)}
            className="journalit-home-position__input"
          />
        </label>
      </div>
      <label className="journalit-home-position__label">
        {t('widget.position-size.profit-target-optional')}
        <input
          type="number"
          step={futuresSpec?.tickSize || 0.01}
          placeholder="0.00"
          value={futuresProfitTarget}
          onChange={(e) => onFuturesProfitTargetChange(e.target.value)}
          className="journalit-home-position__input"
        />
      </label>
    </>
  );
};

interface ForexInputsProps {
  forexSymbol: string;
  onForexSymbolChange: (value: string) => void;
  forexSpec: ForexSpec | undefined;
  forexStopPips: string;
  onForexStopPipsChange: (value: string) => void;
  forexStopInputRef: React.RefObject<HTMLInputElement | null>;
  forexProfitTargetPips: string;
  onForexProfitTargetPipsChange: (value: string) => void;
}

const ForexInputs: React.FC<ForexInputsProps> = ({
  forexSymbol,
  onForexSymbolChange,
  forexSpec,
  forexStopPips,
  onForexStopPipsChange,
  forexStopInputRef,
  forexProfitTargetPips,
  onForexProfitTargetPipsChange,
}) => {
  return (
    <>
      <div className="journalit-home-position__select-wrapper">
        <label className="journalit-home-position__label">
          {t('widget.position-size.currency-pair')}
          <select
            value={forexSymbol}
            onChange={(e) => onForexSymbolChange(e.target.value)}
            className="journalit-home-position__select"
          >
            {FOREX_OPTIONS.map((opt) => (
              <option key={opt.symbol} value={opt.symbol}>
                {opt.symbol} - {opt.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="journalit-home-position__select-icon"
          />
        </label>
      </div>
      {forexSpec && (
        <div className="journalit-home-position__spec-info">
          {t('widget.position-size.pip-value-info', {
            value: forexSpec.pipValue.toString(),
            size: forexSpec.pipSize.toString(),
          })}
        </div>
      )}
      <div className="journalit-home-position__grid">
        <label className="journalit-home-position__label">
          {t('widget.position-size.stop-loss-pips')}
          <input
            ref={forexStopInputRef}
            type="number"
            step="1"
            min="1"
            placeholder={t('widget.position-size.placeholder.example', {
              value: '20',
            })}
            value={forexStopPips}
            onChange={(e) => onForexStopPipsChange(e.target.value)}
            className="journalit-home-position__input"
          />
        </label>
        <label className="journalit-home-position__label">
          {t('widget.position-size.target-pips-optional')}
          <input
            type="number"
            step="1"
            min="1"
            placeholder={t('widget.position-size.placeholder.example', {
              value: '40',
            })}
            value={forexProfitTargetPips}
            onChange={(e) => onForexProfitTargetPipsChange(e.target.value)}
            className="journalit-home-position__input"
          />
        </label>
      </div>
    </>
  );
};

type CalculationResult =
  | StockCalculationResult
  | FuturesCalculationResult
  | ForexCalculationResult
  | null;

interface ResultsProps {
  assetType: PositionSizeAssetType;
  result: CalculationResult;
  riskAmount: number;
  currency: string;
  useDollarValue: boolean;
  stockCalculation: StockCalculationResult | null;
  futuresCalculation: FuturesCalculationResult | null;
  forexCalculation: ForexCalculationResult | null;
  entryPrice: string;
  shouldMask: (kind: string) => boolean;
}

const PositionSizeResults: React.FC<ResultsProps> = ({
  assetType,
  result,
  riskAmount,
  currency,
  useDollarValue,
  stockCalculation,
  futuresCalculation,
  forexCalculation,
  entryPrice,
  shouldMask,
}) => {
  const { formatValue } = useDisplayFormatter();

  const isRiskRewardMasked = shouldMask('metric');
  const riskRewardClass =
    result?.riskRewardRatio == null || isRiskRewardMasked
      ? ''
      : result.riskRewardRatio >= 2
        ? 'journalit-home-position__rr--strong'
        : result.riskRewardRatio >= 1
          ? 'journalit-home-position__rr--medium'
          : 'journalit-home-position__rr--weak';

  return (
    <div className="journalit-home-position__results">
      
      <div className="journalit-home-position__results-primary">
        <span
          className={`journalit-home-position__results-value ${result?.positionSize ? 'journalit-home-position__results-value--active' : ''}`}
        >
          {result?.positionSize
            ? result.positionSize.toFixed(getSizePrecision(assetType))
            : '—'}
        </span>
        <span className="journalit-home-position__results-unit">
          {result?.unit
            ? (() => {
                const key = `form.field.position-size.${result.unit}`;
                return hasTranslation(key) ? t(key) : key;
              })()
            : t('widget.position-size.enter-values')}
        </span>
        
        {assetType === 'stock' &&
          !useDollarValue &&
          stockCalculation?.isLong !== null &&
          stockCalculation?.isLong !== undefined && (
            <span
              className={`journalit-home-position__direction ${stockCalculation.isLong ? 'journalit-home-position__direction--long' : 'journalit-home-position__direction--short'}`}
            >
              {stockCalculation.isLong
                ? t('form.field.direction.long')
                : t('form.field.direction.short')}
            </span>
          )}
        {assetType === 'futures' &&
          futuresCalculation?.isLong !== undefined && (
            <span
              className={`journalit-home-position__direction ${futuresCalculation.isLong ? 'journalit-home-position__direction--long' : 'journalit-home-position__direction--short'}`}
            >
              {futuresCalculation.isLong
                ? t('form.field.direction.long')
                : t('form.field.direction.short')}
            </span>
          )}
      </div>

      
      <div className="journalit-home-position__stats">
        
        <div className="journalit-home-position__stats-left">
          {useDollarValue && assetType === 'stock' ? (
            <>
              <span className="journalit-home-position__stat-label">
                {t('widget.position-size.investment')}{' '}
              </span>
              <span className="journalit-home-position__stat-value">
                {stockCalculation?.dollarAmount
                  ? formatValue({
                      kind: 'notional',
                      value: stockCalculation.dollarAmount,
                      currencyCode: currency,
                    })
                  : '—'}
              </span>
            </>
          ) : (
            <>
              <span className="journalit-home-position__stat-label">
                {t('widget.position-size.risk')}{' '}
              </span>
              <span className="journalit-home-position__stat-value">
                {formatValue({
                  kind: 'risk',
                  value: riskAmount,
                  currencyCode: currency,
                })}
              </span>
            </>
          )}
        </div>
        
        {!useDollarValue &&
        result?.riskRewardRatio != null &&
        result.potentialProfit != null ? (
          <div className="journalit-home-position__stats-right">
            <div>
              <span className="journalit-home-position__stat-label">
                {t('widget.position-size.reward')}{' '}
              </span>
              <span className="journalit-home-position__reward-value">
                {formatValue({
                  kind: 'pnl',
                  value: result.potentialProfit,
                  currencyCode: currency,
                })}
              </span>
            </div>
            <span className={`journalit-home-position__rr ${riskRewardClass}`}>
              {`1:${formatValue({
                kind: 'metric',
                value: result.riskRewardRatio,
                precision: 1,
              })}`}
            </span>
          </div>
        ) : (
          
          <span className="journalit-home-position__extra">
            {assetType === 'stock' &&
              useDollarValue &&
              entryPrice &&
              `@ $${parseFloat(entryPrice).toFixed(2)}`}
            {assetType === 'stock' &&
              !useDollarValue &&
              stockCalculation?.priceDiff &&
              `$${stockCalculation.priceDiff.toFixed(2)} ${t('widget.position-size.stop')}`}
            {assetType === 'futures' &&
              futuresCalculation &&
              `${futuresCalculation.pointsDiff.toFixed(2)} ${t('widget.position-size.pts')}`}
            {assetType === 'forex' &&
              forexCalculation &&
              `${forexCalculation.miniLots.toFixed(1)} ${t('widget.position-size.mini')}`}
          </span>
        )}
      </div>
    </div>
  );
};

type PositionSizeFormState = {
  assetType: PositionSizeAssetType;
  accountBalance: number;
  riskPercentInput: string;
  futuresSymbol: string;
  forexSymbol: string;
  stockDollarValue: string;
  entryPrice: string;
  stopLoss: string;
  stockProfitTarget: string;
  futuresEntry: string;
  futuresStop: string;
  futuresProfitTarget: string;
  forexStopPips: string;
  forexProfitTargetPips: string;
};

type PositionSizeDefaults = {
  riskPercentage: number;
  accountBalance?: number;
  assetType?: PositionSizeAssetType;
  lastFuturesSymbol?: string;
  lastForexSymbol?: string;
};

const createInitialPositionSizeFormState = (
  defaults: PositionSizeDefaults | undefined
): PositionSizeFormState => ({
  assetType: defaults?.assetType || 'stock',
  accountBalance: defaults?.accountBalance || 10000,
  riskPercentInput: formatRiskPercentInput(
    defaults?.riskPercentage ?? DEFAULT_RISK_PERCENT
  ),
  futuresSymbol: defaults?.lastFuturesSymbol || 'ES',
  forexSymbol: defaults?.lastForexSymbol || 'EURUSD',
  stockDollarValue: '',
  entryPrice: '',
  stopLoss: '',
  stockProfitTarget: '',
  futuresEntry: '',
  futuresStop: '',
  futuresProfitTarget: '',
  forexStopPips: '',
  forexProfitTargetPips: '',
});

const positionSizeFormReducer = (
  state: PositionSizeFormState,
  update: Partial<PositionSizeFormState>
): PositionSizeFormState => ({ ...state, ...update });

const PositionSizeWidgetComponent: React.FC<PositionSizeWidgetProps> = ({
  plugin,
  autoFocusOnMount = false,
}) => {
  const { currency } = useCurrency();
  const { shouldMask } = useDisplayFormatter();
  const defaults = plugin.settings.home?.positionSizeDefaults;

  const assetTabs = useMemo<AssetTab[]>(
    () => [
      { id: 'stock', label: t('widget.position-size.stock-crypto') },
      { id: 'futures', label: t('widget.position-size.futures') },
      { id: 'forex', label: t('widget.position-size.forex') },
    ],
    []
  );

  const stockEntryInputRef = useRef<HTMLInputElement>(null);
  const futuresEntryInputRef = useRef<HTMLInputElement>(null);
  const forexStopInputRef = useRef<HTMLInputElement>(null);

  const [formState, dispatchFormState] = useReducer(
    positionSizeFormReducer,
    defaults,
    createInitialPositionSizeFormState
  );
  const {
    assetType,
    accountBalance,
    riskPercentInput,
    futuresSymbol,
    forexSymbol,
    stockDollarValue,
    entryPrice,
    stopLoss,
    stockProfitTarget,
    futuresEntry,
    futuresStop,
    futuresProfitTarget,
    forexStopPips,
    forexProfitTargetPips,
  } = formState;

  const updateFormState = useCallback(
    (update: Partial<PositionSizeFormState>) => dispatchFormState(update),
    []
  );

  useEffect(() => {
    if (!autoFocusOnMount) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (assetType === 'stock') {
        stockEntryInputRef.current?.focus();
        stockEntryInputRef.current?.select();
        return;
      }

      if (assetType === 'futures') {
        futuresEntryInputRef.current?.focus();
        futuresEntryInputRef.current?.select();
        return;
      }

      forexStopInputRef.current?.focus();
      forexStopInputRef.current?.select();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [autoFocusOnMount, assetType]);

  
  const useDollarValue = plugin.settings?.trade?.useDollarValueInput ?? false;

  
  const futuresSpec = useMemo<FuturesSpec | undefined>(
    () => FUTURES_SPECS[futuresSymbol],
    [futuresSymbol]
  );
  const forexSpec = useMemo<ForexSpec | undefined>(
    () => FOREX_SPECS[forexSymbol],
    [forexSymbol]
  );

  const parsedRiskPercent = useMemo(
    () => parseRiskPercentInput(riskPercentInput),
    [riskPercentInput]
  );
  const riskPercent = parsedRiskPercent ?? 0;

  const getCommittedRiskPercent = useCallback(() => {
    return clampRiskPercent(parsedRiskPercent ?? MIN_RISK_PERCENT);
  }, [parsedRiskPercent]);

  const handleRiskPercentBlur = useCallback(() => {
    updateFormState({ riskPercentInput: String(getCommittedRiskPercent()) });
  }, [getCommittedRiskPercent, updateFormState]);

  
  const riskAmount = accountBalance * (riskPercent / 100);

  
  const stockCalculation = useStockCalculation(
    entryPrice,
    stopLoss,
    stockProfitTarget,
    riskAmount,
    useDollarValue,
    stockDollarValue
  );

  const futuresCalculation = useFuturesCalculation(
    futuresEntry,
    futuresStop,
    futuresProfitTarget,
    riskAmount,
    futuresSpec
  );

  const forexCalculation = useForexCalculation(
    forexStopPips,
    forexProfitTargetPips,
    riskAmount,
    forexSpec
  );

  
  const handleSaveDefaults = useCallback(async () => {
    if (!plugin.settings.home) {
      plugin.settings.home = {
        layouts: {},
        activeLayout: 'Default',
      };
    }

    const committedRiskPercent = getCommittedRiskPercent();
    updateFormState({ riskPercentInput: String(committedRiskPercent) });

    plugin.settings.home.positionSizeDefaults = {
      riskPercentage: committedRiskPercent,
      accountBalance: accountBalance,
      assetType: assetType,
      lastFuturesSymbol: futuresSymbol,
      lastForexSymbol: forexSymbol,
    };

    await plugin.saveSettings();
  }, [
    accountBalance,
    getCommittedRiskPercent,
    assetType,
    futuresSymbol,
    forexSymbol,
    plugin,
    updateFormState,
  ]);

  
  const handleReset = useCallback(() => {
    const defs = plugin.settings.home?.positionSizeDefaults;
    dispatchFormState({
      riskPercentInput: formatRiskPercentInput(
        defs?.riskPercentage ?? DEFAULT_RISK_PERCENT
      ),
      accountBalance: defs?.accountBalance ?? 10000,
      assetType: defs?.assetType ?? 'stock',
      futuresSymbol: defs?.lastFuturesSymbol ?? 'ES',
      forexSymbol: defs?.lastForexSymbol ?? 'EURUSD',
      entryPrice: '',
      stopLoss: '',
      stockProfitTarget: '',
      stockDollarValue: '',
      futuresEntry: '',
      futuresStop: '',
      futuresProfitTarget: '',
      forexStopPips: '',
      forexProfitTargetPips: '',
    });
  }, [plugin]);

  const result =
    assetType === 'stock'
      ? stockCalculation
      : assetType === 'futures'
        ? futuresCalculation
        : forexCalculation;

  return (
    <div className="journalit-home-position">
      <PositionSizeHeader
        onSaveDefaults={() => void handleSaveDefaults()}
        onReset={handleReset}
      />

      <PositionSizeTabs
        assetTabs={assetTabs}
        assetType={assetType}
        onAssetTypeChange={(assetType) => updateFormState({ assetType })}
      />

      <CommonInputs
        accountBalance={accountBalance}
        onAccountBalanceChange={(accountBalance) =>
          updateFormState({ accountBalance })
        }
        riskPercentInput={riskPercentInput}
        onRiskPercentInputChange={(riskPercentInput) =>
          updateFormState({ riskPercentInput })
        }
        onRiskPercentBlur={handleRiskPercentBlur}
        parsedRiskPercent={parsedRiskPercent}
      />

      
      {assetType === 'stock' && (
        <StockInputs
          useDollarValue={useDollarValue}
          entryPrice={entryPrice}
          onEntryPriceChange={(entryPrice) => updateFormState({ entryPrice })}
          stockEntryInputRef={stockEntryInputRef}
          stopLoss={stopLoss}
          onStopLossChange={(stopLoss) => updateFormState({ stopLoss })}
          stockProfitTarget={stockProfitTarget}
          onStockProfitTargetChange={(stockProfitTarget) =>
            updateFormState({ stockProfitTarget })
          }
          stockDollarValue={stockDollarValue}
          onStockDollarValueChange={(stockDollarValue) =>
            updateFormState({ stockDollarValue })
          }
        />
      )}

      {assetType === 'futures' && (
        <FuturesInputs
          futuresSymbol={futuresSymbol}
          onFuturesSymbolChange={(futuresSymbol) =>
            updateFormState({ futuresSymbol })
          }
          futuresSpec={futuresSpec}
          futuresEntry={futuresEntry}
          onFuturesEntryChange={(futuresEntry) =>
            updateFormState({ futuresEntry })
          }
          futuresEntryInputRef={futuresEntryInputRef}
          futuresStop={futuresStop}
          onFuturesStopChange={(futuresStop) =>
            updateFormState({ futuresStop })
          }
          futuresProfitTarget={futuresProfitTarget}
          onFuturesProfitTargetChange={(futuresProfitTarget) =>
            updateFormState({ futuresProfitTarget })
          }
        />
      )}

      {assetType === 'forex' && (
        <ForexInputs
          forexSymbol={forexSymbol}
          onForexSymbolChange={(forexSymbol) =>
            updateFormState({ forexSymbol })
          }
          forexSpec={forexSpec}
          forexStopPips={forexStopPips}
          onForexStopPipsChange={(forexStopPips) =>
            updateFormState({ forexStopPips })
          }
          forexStopInputRef={forexStopInputRef}
          forexProfitTargetPips={forexProfitTargetPips}
          onForexProfitTargetPipsChange={(forexProfitTargetPips) =>
            updateFormState({ forexProfitTargetPips })
          }
        />
      )}

      <PositionSizeResults
        assetType={assetType}
        result={result}
        riskAmount={riskAmount}
        currency={currency}
        useDollarValue={useDollarValue}
        stockCalculation={stockCalculation}
        futuresCalculation={futuresCalculation}
        forexCalculation={forexCalculation}
        entryPrice={entryPrice}
        shouldMask={shouldMask}
      />
    </div>
  );
};

export const PositionSizeWidget = memo(PositionSizeWidgetComponent);
