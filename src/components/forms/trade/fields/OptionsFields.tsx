

import React from 'react';
import { NumberInput, FastDateTimeInput } from '../../../core';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { getPricePrecision } from '../utils';
import { t } from '../../../../lang/helpers';

interface OptionsFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}


const OptionsFieldsComponent: React.FC<OptionsFieldsProps> = ({
  data,
  errors,
  onChange,
}) => {
  
  const pricePrecision = getPricePrecision(data.assetType);
  return (
    <>
      <div className="field">
        <FastDateTimeInput
          label={t('form.field.expiration-date')}
          value={data.expirationDate}
          onChange={(date) => onChange('expirationDate', date)}
          error={errors.expirationDate}
          required={true}
        />
      </div>

      <div className="field">
        <NumberInput
          label={t('form.field.strike-price')}
          value={data.strikePrice}
          onChange={(value) => onChange('strikePrice', value)}
          error={errors.strikePrice}
          min={0}
          precision={pricePrecision}
          allowDecimal={true}
          required={true}
        />
      </div>

      <div className="field">
        <label className="label" id="optionType-label">
          {t('form.field.option-type')}
          <span className="required-indicator">*</span>
        </label>
        <div
          className="direction-container"
          role="radiogroup"
          aria-labelledby="optionType-label"
          aria-required="true"
        >
          <button
            type="button"
            className="direction-button"
            onClick={() => onChange('optionType', 'call')}
            aria-checked={data.optionType === 'call'}
            role="radio"
          >
            {t('form.field.option-type.call')}
          </button>
          <button
            type="button"
            className="direction-button"
            onClick={() => onChange('optionType', 'put')}
            aria-checked={data.optionType === 'put'}
            role="radio"
          >
            {t('form.field.option-type.put')}
          </button>
        </div>
        {errors.optionType && (
          <div className="errorMessage" role="alert">
            {errors.optionType}
          </div>
        )}
      </div>

      <div className="field">
        <NumberInput
          label={t('form.field.contract-size')}
          value={data.contractSize}
          onChange={(value) => onChange('contractSize', value)}
          error={errors.contractSize}
          min={1}
          precision={0}
          allowDecimal={false}
        />
      </div>
    </>
  );
};

export const OptionsFields = React.memo(OptionsFieldsComponent);
