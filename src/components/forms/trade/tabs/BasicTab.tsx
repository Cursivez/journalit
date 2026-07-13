

import React from 'react';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { TradeTypeSelector } from '../fields/TradeTypeSelector';
import { AssetFields } from '../fields/AssetFields';
import { TradeFormLayoutSettings } from '../../../../settings/types';

interface BasicTabProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  instruments: Array<{ id: string; name: string }>;
  onAccountRequirementChange?: (isBlocked: boolean) => void;
  layout: TradeFormLayoutSettings;
  forcePriceInputMode?: boolean;
  isEditMode: boolean;
}

export const BasicTab: React.FC<BasicTabProps> = ({
  data,
  errors,
  onChange,
  instruments,
  onAccountRequirementChange,
  layout,
  forcePriceInputMode = false,
  isEditMode,
}) => {
  return (
    <div className="trade-form-basic-tab">
      
      <TradeTypeSelector data={data} onChange={onChange} />

      
      <AssetFields
        data={data}
        errors={errors}
        onChange={onChange}
        instruments={instruments}
        onAccountRequirementChange={onAccountRequirementChange}
        layout={layout}
        forcePriceInputMode={forcePriceInputMode}
        isEditMode={isEditMode}
      />
    </div>
  );
};
