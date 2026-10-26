

import React, { useId } from 'react';
import { NumberInput } from '../../../core/NumberInput';
import { Button } from '../../../ui/Button';
import { t } from '../../../../lang/helpers';

interface PlannedPriceTargetRow {
  key: string;
  price?: number;
  amount?: number;
  amountPlaceholder?: string;
  priceError?: string;
  amountError?: string;
}

interface PlannedPriceTargetListProps {
  title: string;
  removeLabel: string;
  indexPrefix: string;
  indexHeader: string;
  priceHeader: string;
  amountHeader: string;
  pricePlaceholder: string;
  pricePrecision: number;
  amountPrecision: number;
  amountMax?: number;
  rows: PlannedPriceTargetRow[];
  emptyState?: string;
  
  listError?: string;
  footer?: React.ReactNode;
  onPriceChange: (index: number, value: number | undefined) => void;
  onAmountChange: (index: number, value: number | undefined) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function PlannedPriceTargetList({
  title,
  removeLabel,
  indexPrefix,
  indexHeader,
  priceHeader,
  amountHeader,
  pricePlaceholder,
  pricePrecision,
  amountPrecision,
  amountMax,
  rows,
  emptyState,
  listError,
  footer,
  onPriceChange,
  onAmountChange,
  onAdd,
  onRemove,
}: PlannedPriceTargetListProps) {
  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;
  const addId = `${idPrefix}-add`;
  const priceHeaderId = `${idPrefix}-price`;
  const amountHeaderId = `${idPrefix}-amount`;
  return (
    <div className="planned-targets-section">
      <div className="planned-targets-header">
        <div className="label" id={titleId}>
          {title}
        </div>
        <Button
          id={addId}
          type="button"
          variant="plain"
          size="small"
          className="planned-target-add-button"
          onClick={onAdd}
          aria-labelledby={`${addId} ${titleId}`}
        >
          + {t('button.add')}
        </Button>
      </div>
      {rows.length > 0 && (
        <div className="planned-targets-list">
          <div className="planned-target-row planned-target-row-header">
            <span>{indexHeader}</span>
            <span id={priceHeaderId}>{priceHeader}</span>
            <span id={amountHeaderId}>{amountHeader}</span>
            <span aria-hidden="true" />
          </div>
          {rows.map((row, index) => (
            <div className="planned-target-row" key={row.key}>
              <span
                className="planned-target-index-label"
                id={`${idPrefix}-row-${index}`}
              >
                {indexPrefix}
                {index + 1}
              </span>
              <NumberInput
                aria-labelledby={`${priceHeaderId} ${idPrefix}-row-${index}`}
                value={row.price}
                onChange={(value) => onPriceChange(index, value)}
                error={row.priceError}
                precision={pricePrecision}
                allowDecimal={true}
                placeholder={pricePlaceholder}
              />
              <NumberInput
                aria-labelledby={`${amountHeaderId} ${idPrefix}-row-${index}`}
                value={row.amount}
                onChange={(value) => onAmountChange(index, value)}
                error={row.amountError}
                min={0}
                max={amountMax}
                precision={amountPrecision}
                allowDecimal={amountPrecision > 0}
                placeholder={row.amountPlaceholder}
              />
              <Button
                type="button"
                variant="plain"
                size="small"
                className="planned-target-remove-button"
                onClick={() => onRemove(index)}
                aria-label={removeLabel}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
      {listError && (
        <div className="errorMessage" role="alert">
          {listError}
        </div>
      )}
      {rows.length === 0 && emptyState && (
        <div className="planned-targets-empty-state">
          <span>{emptyState}</span>
        </div>
      )}
      {footer}
    </div>
  );
}
