

import React from 'react';
import { t } from '../../lang/helpers';
import { useGuideTarget } from '../../guides/GuideRuntimeLayer';
import { ECONOMIC_CALENDAR_SETTINGS_TARGET_ID } from '../../guides/economicCalendarGuideIds';
import { RefreshCw, Settings2 } from '../shared/icons/ObsidianIcon';

interface EconomicCalendarHeaderProps {
  refreshDisabled: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export const EconomicCalendarHeader: React.FC<EconomicCalendarHeaderProps> = ({
  refreshDisabled,
  onRefresh,
  onOpenSettings,
}) => {
  const registerSettingsTarget = useGuideTarget(
    ECONOMIC_CALENDAR_SETTINGS_TARGET_ID
  );

  return (
    <div className="journalit-econ-header">
      <div className="journalit-econ-header__titles">
        <div className="journalit-econ-header__heading">
          <h1 className="journalit-econ-header__title">
            {t('view.economic-calendar.title')}
          </h1>
          <span className="journalit-econ-header__week">
            {t('view.economic-calendar.this-week')}
          </span>
        </div>
      </div>
      <div className="journalit-econ-header__actions">
        <button
          type="button"
          className="journalit-econ-header__refresh"
          onClick={onRefresh}
          disabled={refreshDisabled}
          aria-label={t('view.economic-calendar.refresh')}
        >
          <RefreshCw size={15} aria-hidden="true" />
        </button>
        <button
          ref={registerSettingsTarget}
          type="button"
          className="journalit-econ-header__refresh"
          onClick={onOpenSettings}
          aria-label={t('view.economic-calendar.sync.aria')}
        >
          <Settings2 size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

EconomicCalendarHeader.displayName = 'EconomicCalendarHeader';
