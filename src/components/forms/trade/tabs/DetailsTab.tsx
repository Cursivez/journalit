

import React from 'react';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { CommonFields } from '../fields/CommonFields';
import { MetadataFields } from '../fields/MetadataFields';

interface DetailsTabProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  accounts: Array<{ id: string; name: string }>;
  setups: Array<{ id: string; name: string }>;
  mistakes: Array<{ id: string; name: string }>;
  availableTags: string[];
  onAddImage: (file: File) => Promise<string>;
  onDeleteImage: (imagePath: string) => Promise<void>;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
  data,
  errors,
  onChange,
  accounts,
  setups,
  mistakes,
  availableTags,
  onAddImage,
  onDeleteImage,
}) => {
  return (
    <div className="trade-form-details-tab">
      
      <CommonFields
        data={data}
        errors={errors}
        onChange={onChange}
        accounts={accounts}
        setups={setups}
        mistakes={mistakes}
      />

      
      <MetadataFields
        data={data}
        onChange={onChange}
        availableTags={availableTags}
        onAddImage={onAddImage}
        onDeleteImage={onDeleteImage}
        sourcePath={data.filePath || ''}
      />
    </div>
  );
};
