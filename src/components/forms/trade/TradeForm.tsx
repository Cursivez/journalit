

import React, { useState, useEffect } from 'react';
import { TradeFormData, TradeFormErrors, TradeFormProps } from './types';

const EMPTY_INITIAL_TRADE_DATA: Partial<TradeFormData> = {};
import { BasicTab, DetailsTab, AdvancedTab } from './tabs';
import { useTradeForm } from './hooks';
import { FormActions } from './components';
import { t, tPlural } from '../../../lang/helpers';


export const TradeForm: React.FC<TradeFormProps> = ({
  initialData = EMPTY_INITIAL_TRADE_DATA,
  isSubmitting = false,
  isEditMode = false,
  onSubmit,
  onCancel,
  onDirtyStateChange,
}) => {
  
  const {
    formData,
    errors,
    formRef,
    handleFieldChange,
    handleAddImage,
    deleteImageFile,
    handleSubmit,
    handleCancel,
    isDirty,
  } = useTradeForm({
    initialData,
    isEditMode,
    onSubmit,
    onCancel,
  });

  
  useEffect(() => {
    if (onDirtyStateChange) {
      onDirtyStateChange(isDirty);
    }
  }, [isDirty, onDirtyStateChange]);

  
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [isAccountCreationBlocked, setIsAccountCreationBlocked] =
    useState(false);

  const customFieldValues = formData.customFields ?? {};

  
  useEffect(() => {}, []); 

  
  
  const emptyAccounts: Array<{ id: string; name: string }> = [];
  const emptySetups: Array<{ id: string; name: string }> = [];
  const emptyMistakes: Array<{ id: string; name: string }> = [];
  const emptyInstruments: Array<{ id: string; name: string }> = [];
  const emptyTags: string[] = [];

  

  const handleCustomFieldChange = (fieldId: string, value: unknown) => {
    const newCustomFieldValues = {
      ...customFieldValues,
      [fieldId]: value,
    };

    handleFieldChange('customFields', newCustomFieldValues);
  };

  
  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  
  const tabErrorCounts = React.useMemo(() => {
    const basicTabFields: Array<keyof TradeFormErrors> = [
      'instrument',
      'direction',
      'assetType',
      'form',
      'entries',
      'exits',
      'dividends',
      'entriesExits',
      'entryTime',
      'entryPrice',
      'positionSize',
      'exitTime',
      'exitPrice',

      'commission',
      'commissionType',
      'fees',
      'swap',
      'exchange',
      'strikePrice',
      'optionType',
      'contractSize',
      'expirationDate',
      'dollarPerPoint',
      'tickSize',
      'tickValue',
      'contractSymbol',
      'lotSize',
      'pipValue',
      'currencyPair',
      'cryptoExchange',
      'tradingPair',
      'leverageRatio',
      'directPnL',
      'stopLoss',
      'takeProfits',
      'riskAmount',
    ];

    const detailsTabFields: Array<keyof TradeFormErrors> = ['setupIds'];

    const advancedTabFields: Array<keyof TradeFormErrors> = ['customFields'];

    
    const basicErrors = basicTabFields.filter((field) => {
      const error = errors[field];
      return error && error !== '';
    });
    const detailsErrors = detailsTabFields.filter((field) => {
      const error = errors[field];
      return error && error !== '';
    });
    const advancedErrors = advancedTabFields.filter((field) => {
      const error = errors[field];
      return error && error !== '';
    });

    return {
      basic: basicErrors.length,
      details: detailsErrors.length,
      advanced: advancedErrors.length,
    };
  }, [errors]); 

  
  const tabs = [
    {
      id: 'basic',
      label: t('form.tab.basic'),
      errorCount: tabErrorCounts.basic,
    },
    {
      id: 'details',
      label: t('form.tab.details'),
      errorCount: tabErrorCounts.details,
    },
    {
      id: 'advanced',
      label: t('form.tab.advanced'),
      errorCount: tabErrorCounts.advanced,
    },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicTab
            data={formData}
            errors={errors}
            onChange={handleFieldChange}
            instruments={emptyInstruments}
            onAccountRequirementChange={setIsAccountCreationBlocked}
          />
        );
      case 'details':
        return (
          <DetailsTab
            data={formData}
            errors={errors}
            onChange={handleFieldChange}
            accounts={emptyAccounts}
            setups={emptySetups}
            mistakes={emptyMistakes}
            availableTags={emptyTags}
            onAddImage={handleAddImage}
            onDeleteImage={deleteImageFile}
          />
        );
      case 'advanced':
        return (
          <AdvancedTab
            data={formData}
            errors={errors}
            onChange={handleFieldChange}
            customFieldValues={customFieldValues}
            onCustomFieldChange={handleCustomFieldChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form
      ref={formRef}
      className="formContainer"
      onSubmit={(event) => void handleSubmit(event)}
    >
      
      {(errors.form ||
        tabErrorCounts.basic > 0 ||
        tabErrorCounts.details > 0 ||
        tabErrorCounts.advanced > 0) && (
        <div className="errorSummary">
          <strong>{t('validation.fix-errors')}</strong>
          <ul>
            {errors.form && <li>{errors.form}</li>}
            {tabErrorCounts.basic > 0 && (
              <li>
                {tPlural('validation.basic-tab-errors', tabErrorCounts.basic)}
              </li>
            )}
            {tabErrorCounts.details > 0 && (
              <li>
                {tPlural(
                  'validation.details-tab-errors',
                  tabErrorCounts.details
                )}
              </li>
            )}
            {tabErrorCounts.advanced > 0 && (
              <li>
                {tPlural(
                  'validation.advanced-tab-errors',
                  tabErrorCounts.advanced
                )}
              </li>
            )}
          </ul>
        </div>
      )}

      
      <nav className="journalit-tab-nav">
        <div className="journalit-tab-wrapper">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`journalit-tab-button ${activeTab === tab.id ? 'journalit-tab-active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
              {tab.errorCount > 0 && (
                <span className="journalit-tab-error-badge">
                  {tab.errorCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {isEditMode && (
          <span className="journalit-edit-badge">{t('validation.edit')}</span>
        )}
      </nav>

      
      {getTabContent()}

      
      <FormActions
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        errors={errors}
        isEditMode={isEditMode}
        hasEntryTime={!!initialData.entryTime}
        disabledReason={
          isAccountCreationBlocked
            ? t('form.account-empty-state.submit-disabled')
            : undefined
        }
      />
    </form>
  );
};
