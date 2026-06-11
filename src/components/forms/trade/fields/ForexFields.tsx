

import React from 'react';
import { t } from '../../../../lang/helpers';
import { NumberInput } from '../../../core';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';

interface ForexFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}


const ForexFieldsComponent: React.FC<ForexFieldsProps> = ({
  data,
  errors,
  onChange,
}) => {
  
  const standardLotSizes = [100000, 10000, 1000];

  
  const isCustomLotSize =
    data.lotSize !== undefined &&
    data.lotSize !== null &&
    !standardLotSizes.includes(data.lotSize);

  return (
    <>
      <div className="field">
        <label className="label" id="lotSize-label">
          {t('form.field.lot-size')}
        </label>
        <div
          className="asset-type-container"
          role="radiogroup"
          aria-labelledby="lotSize-label"
        >
          {[
            { value: 100000, label: t('form.field.lot-size.standard') },
            { value: 10000, label: t('form.field.lot-size.mini') },
            { value: 1000, label: t('form.field.lot-size.micro') },
            { value: 'custom', label: t('form.field.lot-size.custom') },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className="asset-type-button"
              onClick={() => {
                if (option.value === 'custom') {
                  
                  onChange('lotSize', isCustomLotSize ? data.lotSize : 0);
                } else {
                  onChange('lotSize', option.value);
                }
              }}
              aria-checked={
                option.value === 'custom'
                  ? isCustomLotSize
                  : data.lotSize === option.value
              }
              role="radio"
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.lotSize && (
          <div className="errorMessage" role="alert">
            {errors.lotSize}
          </div>
        )}
      </div>

      
      {Boolean(isCustomLotSize) && (
        <div className="field">
          <NumberInput
            label={t('form.field.custom-lot-size')}
            value={data.lotSize}
            onChange={(value) => onChange('lotSize', value)}
            error={errors.lotSize}
            min={1}
            precision={0}
            allowDecimal={false}
            required={true}
          />
        </div>
      )}

      <div className="field">
        <NumberInput
          label={t('form.field.pip-value')}
          value={data.pipValue}
          onChange={(value) => onChange('pipValue', value)}
          error={errors.pipValue}
          min={0}
          precision={4}
          allowDecimal={true}
        />
      </div>
    </>
  );
};

export const ForexFields = React.memo(ForexFieldsComponent);
