

import React, { useEffect, useState } from 'react';
import JournalitPlugin from '../../../main';
import { CustomOptionsTab } from '../CustomOptionsTab';
import { CustomFieldsManager } from './CustomFieldsManager';
import { ReviewFieldsManager } from './ReviewFieldsManager';
import { Accordion } from '../../../components/shared/Accordion';
import { OptionType } from '../../../services/options/CustomOptionsService';
import { t } from '../../../lang/helpers';

interface CustomizationTabProps {
  plugin: JournalitPlugin;
}

export const CustomizationTab: React.FC<CustomizationTabProps> = ({
  plugin,
}) => {
  
  const [customFieldsExpanded, setCustomFieldsExpanded] = useState(false);
  const [reviewFieldsExpanded, setReviewFieldsExpanded] = useState(false);

  
  const [customFieldsRemeasureContent, setCustomFieldsRemeasureContent] =
    useState<(() => void) | null>(null);
  const [reviewFieldsRemeasureContent, setReviewFieldsRemeasureContent] =
    useState<(() => void) | null>(null);

  useEffect(() => {
    const consumeCustomFieldsOpenRequest = () => {
      if (
        window.sessionStorage.getItem(
          'journalit:open-custom-fields-settings'
        ) !== '1'
      ) {
        return;
      }

      window.sessionStorage.removeItem('journalit:open-custom-fields-settings');
      setCustomFieldsExpanded(true);
      requestAnimationFrame(() => {
        document
          .querySelector('.custom-fields-manager')
          ?.scrollIntoView({ block: 'start' });
      });
    };

    consumeCustomFieldsOpenRequest();
    window.addEventListener(
      'journalit:open-custom-fields-settings',
      consumeCustomFieldsOpenRequest
    );
    return () => {
      window.removeEventListener(
        'journalit:open-custom-fields-settings',
        consumeCustomFieldsOpenRequest
      );
    };
  }, []);

  return (
    <div className="journalit-settings-tab customization-settings">
      <h3>{t('settings.customization.title')}</h3>
      <p className="setting-item-description">
        {t('settings.customization.description')}
      </p>

      
      <Accordion
        title={t('settings.customization.tickers-symbols')}
        defaultExpanded={false}
      >
        <CustomOptionsTab plugin={plugin} filterType={OptionType.INSTRUMENT} />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.symbol-mappings')}
        defaultExpanded={false}
      >
        <CustomOptionsTab plugin={plugin} showSymbolMappings={true} />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.account-types')}
        defaultExpanded={false}
      >
        <CustomOptionsTab
          plugin={plugin}
          filterType={OptionType.ACCOUNT_TYPE}
        />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.setups')}
        defaultExpanded={false}
      >
        <CustomOptionsTab plugin={plugin} filterType={OptionType.SETUP} />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.mistakes')}
        defaultExpanded={false}
      >
        <CustomOptionsTab plugin={plugin} filterType={OptionType.MISTAKE} />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.tags')}
        defaultExpanded={false}
      >
        <CustomOptionsTab plugin={plugin} filterType={OptionType.TAG} />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.events')}
        defaultExpanded={false}
      >
        <CustomOptionsTab plugin={plugin} filterType={OptionType.EVENT} />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.trade-fields')}
        defaultExpanded={false}
        expanded={customFieldsExpanded}
        onExpandedChange={setCustomFieldsExpanded}
        onRemeasureContentChange={setCustomFieldsRemeasureContent}
      >
        <CustomFieldsManager
          plugin={plugin}
          onRequestExpansion={() => setCustomFieldsExpanded(true)}
          remeasureContent={customFieldsRemeasureContent || undefined}
        />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.review-fields')}
        defaultExpanded={false}
        expanded={reviewFieldsExpanded}
        onExpandedChange={setReviewFieldsExpanded}
        onRemeasureContentChange={setReviewFieldsRemeasureContent}
      >
        <ReviewFieldsManager
          plugin={plugin}
          onRequestExpansion={() => setReviewFieldsExpanded(true)}
          remeasureContent={reviewFieldsRemeasureContent || undefined}
        />
      </Accordion>
    </div>
  );
};
