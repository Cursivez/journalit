

import React, { useEffect, useReducer, useState } from 'react';
import JournalitPlugin from '../../../main';
import { CustomOptionsTab } from '../CustomOptionsTab';
import { CustomFieldsManager } from './CustomFieldsManager';
import { ReviewFieldsManager } from './ReviewFieldsManager';

import { Accordion } from '../../../components/shared/Accordion';
import { OptionType } from '../../../services/options/CustomOptionsService';
import { openTradeFormLayoutSettingsModal } from '../../../components/forms/trade/TradeFormLayoutSettingsModal';
import { Button } from '../../../components/ui/Button';
import { t } from '../../../lang/helpers';

interface CustomizationTabProps {
  plugin: JournalitPlugin;
}

interface CustomizationExpansionState {
  customFields: boolean;
  reviewFields: boolean;
}

type CustomizationExpansionAction =
  | { type: 'set-custom-fields'; expanded: boolean }
  | { type: 'set-review-fields'; expanded: boolean };

const customizationExpansionReducer = (
  state: CustomizationExpansionState,
  action: CustomizationExpansionAction
): CustomizationExpansionState => {
  switch (action.type) {
    case 'set-custom-fields':
      return { ...state, customFields: action.expanded };
    case 'set-review-fields':
      return { ...state, reviewFields: action.expanded };
  }
};

export const CustomizationTab: React.FC<CustomizationTabProps> = ({
  plugin,
}) => {
  const [expandedAccordions, dispatchExpandedAccordions] = useReducer(
    customizationExpansionReducer,
    {
      customFields: false,
      reviewFields: false,
    }
  );

  
  const [customFieldsRemeasureContent, setCustomFieldsRemeasureContent] =
    useState<(() => void) | null>(null);
  const [reviewFieldsRemeasureContent, setReviewFieldsRemeasureContent] =
    useState<(() => void) | null>(null);

  useEffect(() => {
    const consumeCustomFieldsOpenRequest = () => {
      if (
        plugin.app.loadLocalStorage('journalit:open-custom-fields-settings') !==
        '1'
      ) {
        return;
      }

      plugin.app.saveLocalStorage(
        'journalit:open-custom-fields-settings',
        null
      );
      dispatchExpandedAccordions({ type: 'set-custom-fields', expanded: true });
      window.requestAnimationFrame(() => {
        window.activeDocument
          .querySelector('.custom-fields-manager')
          ?.scrollIntoView({ block: 'start' });
      });
    };

    const consumeReviewFieldsOpenRequest = () => {
      if (
        plugin.app.loadLocalStorage('journalit:open-review-fields-settings') !==
        '1'
      ) {
        return;
      }

      plugin.app.saveLocalStorage(
        'journalit:open-review-fields-settings',
        null
      );
      dispatchExpandedAccordions({ type: 'set-review-fields', expanded: true });
      window.requestAnimationFrame(() => {
        window.activeDocument
          .querySelector('.review-fields-manager')
          ?.scrollIntoView({ block: 'start' });
      });
    };

    consumeCustomFieldsOpenRequest();
    consumeReviewFieldsOpenRequest();
    window.addEventListener(
      'journalit:open-custom-fields-settings',
      consumeCustomFieldsOpenRequest
    );
    window.addEventListener(
      'journalit:open-review-fields-settings',
      consumeReviewFieldsOpenRequest
    );
    return () => {
      window.removeEventListener(
        'journalit:open-custom-fields-settings',
        consumeCustomFieldsOpenRequest
      );
      window.removeEventListener(
        'journalit:open-review-fields-settings',
        consumeReviewFieldsOpenRequest
      );
    };
  }, [plugin]);

  return (
    <div className="journalit-settings-tab customization-settings">
      <h3>{t('settings.customization.title')}</h3>
      <p className="setting-item-description">
        {t('settings.customization.description')}
      </p>

      <div className="journalit-settings-trade-form-layout-card">
        <div className="journalit-settings-trade-form-layout-card__content">
          <h4>{t('form.layout.settings-title')}</h4>
          <p>{t('settings.customization.trade-form-layout.description')}</p>
        </div>
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            openTradeFormLayoutSettingsModal({ app: plugin.app, plugin });
          }}
        >
          {t('settings.customization.trade-form-layout.button')}
        </Button>
      </div>

      
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
        expanded={expandedAccordions.customFields}
        onExpandedChange={(expanded) =>
          dispatchExpandedAccordions({ type: 'set-custom-fields', expanded })
        }
        onRemeasureContentChange={setCustomFieldsRemeasureContent}
      >
        <CustomFieldsManager
          plugin={plugin}
          onRequestExpansion={() =>
            dispatchExpandedAccordions({
              type: 'set-custom-fields',
              expanded: true,
            })
          }
          remeasureContent={customFieldsRemeasureContent || undefined}
        />
      </Accordion>

      
      <Accordion
        title={t('settings.customization.review-fields')}
        defaultExpanded={false}
        expanded={expandedAccordions.reviewFields}
        onExpandedChange={(expanded) =>
          dispatchExpandedAccordions({ type: 'set-review-fields', expanded })
        }
        onRemeasureContentChange={setReviewFieldsRemeasureContent}
      >
        <ReviewFieldsManager
          plugin={plugin}
          onRequestExpansion={() =>
            dispatchExpandedAccordions({
              type: 'set-review-fields',
              expanded: true,
            })
          }
          remeasureContent={reviewFieldsRemeasureContent || undefined}
        />
      </Accordion>
    </div>
  );
};
