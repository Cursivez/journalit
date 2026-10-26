

import React, { useState } from 'react';
import { t } from '../../../../lang/helpers';
import type { TradeFormStopLossUnit } from '../../../../settings/types';
import {
  hasStopLossAmount,
  resolveExplicitStopSize,
  type StopLossTarget,
} from '../../../../services/trade/core/StopLossTargets';
import {
  resolveTradeRiskPositionSize,
  resolveTradeStopLossCoverage,
} from '../../../../utils/riskCalculation';
import type { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { PlannedPriceTargetList } from './PlannedPriceTargetList';

interface StopLossesSectionProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  pricePrecision: number;
  sizePrecision: number;
  unit: TradeFormStopLossUnit;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

const createStopLossClientId = (): string =>
  `stop-loss-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isPositiveNumber = (value: unknown): value is number =>
  isFiniteNumber(value) && value > 0;


const getEntrySizes = (data: Partial<TradeFormData>): number[] =>
  (data.entries ?? []).flatMap((entry) =>
    isPositiveNumber(entry.price) && isPositiveNumber(entry.size)
      ? [entry.size]
      : []
  );

const formatPercent = (value: number): string =>
  `${Math.round(value * 10) / 10}%`;

export function StopLossesSection({
  data,
  errors,
  pricePrecision,
  sizePrecision,
  unit,
  onChange,
}: StopLossesSectionProps) {
  const stopLosses = data.stopLosses ?? [];
  const useSizeUnit = unit === 'size';
  const entrySizes = getEntrySizes(data);
  const positionSize = resolveTradeRiskPositionSize(data);

  const [generatedClientIds] = useState(() => new WeakMap<object, string>());
  const getStopLossKey = (target: StopLossTarget): string => {
    if (target.clientId) return target.clientId;
    const existingId = generatedClientIds.get(target);
    if (existingId) return existingId;
    const nextId = createStopLossClientId();
    generatedClientIds.set(target, nextId);
    return nextId;
  };

  const roundToSizePrecision = (value: number): number => {
    const factor = 10 ** sizePrecision;
    return Math.round(value * factor) / factor;
  };

  const resolveExplicitPercent = (target: StopLossTarget): number => {
    if (isFiniteNumber(target.closePercent)) {
      return Math.max(target.closePercent, 0);
    }
    if (positionSize !== undefined && isFiniteNumber(target.size)) {
      return Math.max((target.size / positionSize) * 100, 0);
    }
    return 0;
  };

  const updateStopLoss = (
    index: number,
    field: 'price' | 'closePercent' | 'size',
    value: number | undefined
  ) => {
    onChange(
      'stopLosses',
      stopLosses.map((target, targetIndex) => {
        if (targetIndex !== index) return target;
        const nextTarget: StopLossTarget = {
          ...target,
          clientId: getStopLossKey(target),
          [field]: value,
        };
        
        
        if (field === 'closePercent') delete nextTarget.size;
        if (field === 'size') delete nextTarget.closePercent;
        return nextTarget;
      })
    );
  };

  const addStopLossBySize = (base: StopLossTarget[]): StopLossTarget[] => {
    const [singleStop] = base;
    if (base.length === 1 && !hasStopLossAmount(singleStop)) {
      
      if (entrySizes.length >= 2) {
        return [
          { ...singleStop, size: entrySizes[0] },
          { clientId: createStopLossClientId(), size: entrySizes[1] },
        ];
      }
      if (positionSize !== undefined) {
        const firstHalf = roundToSizePrecision(positionSize / 2);
        const secondHalf = roundToSizePrecision(positionSize - firstHalf);
        if (firstHalf > 0 && secondHalf > 0) {
          return [
            { ...singleStop, size: firstHalf },
            { clientId: createStopLossClientId(), size: secondHalf },
          ];
        }
      }
    }

    const nextEntrySize = entrySizes[base.length];
    const hasBlankStop = base.some((target) => !hasStopLossAmount(target));
    const allocatedSize = base.reduce(
      (total, target) => total + resolveExplicitStopSize(target, positionSize),
      0
    );
    const remainingSize =
      positionSize !== undefined
        ? roundToSizePrecision(Math.max(0, positionSize - allocatedSize))
        : 0;
    let size: number | undefined;
    if (nextEntrySize !== undefined && nextEntrySize <= remainingSize) {
      size = nextEntrySize;
    } else if (!hasBlankStop && remainingSize > 0) {
      size = remainingSize;
    }
    return [...base, { clientId: createStopLossClientId(), size }];
  };

  const addStopLossByPercent = (base: StopLossTarget[]): StopLossTarget[] => {
    const [singleStop] = base;
    if (
      base.length === 1 &&
      !isFiniteNumber(singleStop.size) &&
      (singleStop.closePercent === undefined || singleStop.closePercent === 100)
    ) {
      return [
        { ...singleStop, closePercent: 50 },
        { clientId: createStopLossClientId(), closePercent: 50 },
      ];
    }

    const hasBlankStop = base.some((target) => !hasStopLossAmount(target));
    const allocatedPercent = base.reduce(
      (total, target) => total + resolveExplicitPercent(target),
      0
    );
    const remainingPercent = Math.max(0, Math.round(100 - allocatedPercent));
    return [
      ...base,
      {
        clientId: createStopLossClientId(),
        closePercent:
          !hasBlankStop && remainingPercent > 0 ? remainingPercent : undefined,
      },
    ];
  };

  const addStopLoss = () => {
    if (stopLosses.length === 0) {
      
      onChange('stopLosses', [{ clientId: createStopLossClientId() }]);
      return;
    }
    const base = stopLosses.map((target) => ({
      ...target,
      clientId: getStopLossKey(target),
    }));
    onChange(
      'stopLosses',
      useSizeUnit ? addStopLossBySize(base) : addStopLossByPercent(base)
    );
  };

  const removeStopLoss = (index: number) => {
    onChange(
      'stopLosses',
      stopLosses.filter((_, targetIndex) => targetIndex !== index)
    );
  };

  const formatSize = (value: number): string =>
    String(roundToSizePrecision(value));

  
  
  
  const getAmountPlaceholder = (target: StopLossTarget): string => {
    if (useSizeUnit && isFiniteNumber(target.closePercent)) {
      return formatPercent(target.closePercent);
    }
    if (!useSizeUnit && isFiniteNumber(target.size)) {
      return t('form.placeholder.stop-loss-size-amount', {
        size: formatSize(target.size),
      });
    }
    return t('form.placeholder.stop-loss-rest');
  };

  
  
  
  const coverage = resolveTradeStopLossCoverage(data);
  const footer =
    coverage.status === 'partial' ? (
      <div className="planned-targets-footer" role="status">
        {t('form.stop-loss.coverage', {
          percent: formatPercent(
            (coverage.coveredSize / coverage.positionSize) * 100
          ),
        })}{' '}
        {t('form.stop-loss.coverage-partial')}
      </div>
    ) : null;

  return (
    <PlannedPriceTargetList
      title={t('form.field.stop-loss')}
      removeLabel={t('form.action.remove-stop-loss')}
      indexPrefix={t('form.field.stop-loss-short')}
      indexHeader={t('form.field.stop-loss-short')}
      priceHeader={t('form.field.stop-price')}
      amountHeader={
        useSizeUnit
          ? t('form.field.stop-loss-size')
          : t('form.field.stop-loss-percent')
      }
      pricePlaceholder={t('form.placeholder.stop-loss')}
      pricePrecision={pricePrecision}
      amountPrecision={useSizeUnit ? sizePrecision : 0}
      amountMax={useSizeUnit ? undefined : 100}
      rows={stopLosses.map((target, index) => ({
        key: getStopLossKey(target),
        price: target.price,
        amount: useSizeUnit ? target.size : target.closePercent,
        amountPlaceholder: getAmountPlaceholder(target),
        priceError: errors.stopLosses?.[index]?.price,
        amountError: useSizeUnit
          ? errors.stopLosses?.[index]?.size
          : errors.stopLosses?.[index]?.closePercent,
      }))}
      emptyState={t('form.empty.stop-losses')}
      listError={errors.stopLossesTotal}
      footer={footer}
      onPriceChange={(index, value) => updateStopLoss(index, 'price', value)}
      onAmountChange={(index, value) =>
        updateStopLoss(index, useSizeUnit ? 'size' : 'closePercent', value)
      }
      onAdd={addStopLoss}
      onRemove={removeStopLoss}
    />
  );
}
