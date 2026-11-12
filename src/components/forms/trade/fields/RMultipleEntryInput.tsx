

import React from 'react';
import { NumberInput } from '../../../core/NumberInput';
import {
  useDisplayFormatter,
  useDisplayPolicy,
} from '../../../../hooks/useDisplayPolicy';
import { t } from '../../../../lang/helpers';
import {
  resolveRMultipleEntryDisplayValue,
  resolveRMultipleEntryRisk,
} from '../rMultipleEntry';
import { RiskAmountActions } from './RiskAmountActions';
import type {
  RMultipleEntryField,
  TradeFormData,
  TradeFormValue,
} from '../types';

interface RMultipleEntryInputProps {
  field: RMultipleEntryField;
  data: Partial<TradeFormData>;
  label: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  currencyCode?: string;
  defaultRiskAmount: number | undefined;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

export function RMultipleEntryInput({
  field,
  data,
  label,
  placeholder,
  error,
  required,
  currencyCode,
  defaultRiskAmount,
  onChange,
}: RMultipleEntryInputProps) {
  const { formatValue } = useDisplayFormatter();
  const { hideDollarAmounts } = useDisplayPolicy();
  const risk = resolveRMultipleEntryRisk(data, defaultRiskAmount);
  const storedCurrencyValue = data[field];
  const hasTypedR = data.rEntries !== undefined && field in data.rEntries;

  
  
  let hint: string | null;
  if (risk.status === 'known') {
    hint = hideDollarAmounts
      ? null
      : t('form.r-entry.one-r', {
          amount: formatValue({
            kind: 'risk',
            value: risk.amount,
            currencyCode,
          }),
        });
  } else if (risk.status === 'stop-unpriced') {
    hint = t('form.r-entry.stop-unpriced');
  } else if (
    !hideDollarAmounts &&
    !hasTypedR &&
    typeof storedCurrencyValue === 'number'
  ) {
    
    
    hint = t('form.r-entry.saved-without-risk', {
      amount: formatValue({
        kind: 'pnl',
        value: storedCurrencyValue,
        currencyCode,
      }),
    });
  } else {
    hint = t('form.r-entry.needs-risk');
  }

  return (
    <>
      <NumberInput
        label={label}
        value={resolveRMultipleEntryDisplayValue(data, field, risk)}
        onChange={(value) => onChange('rEntries', { [field]: value })}
        error={error}
        allowDecimal={true}
        precision={2}
        required={required}
        placeholder={placeholder}
      />
      {!error && hint && <span className="calculated-risk-hint">{hint}</span>}
      
      {risk.status === 'unknown' && data.rEntries?.[field] !== undefined && (
        <RiskAmountActions />
      )}
    </>
  );
}
