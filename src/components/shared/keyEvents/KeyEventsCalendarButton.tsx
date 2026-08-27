

import React, { useCallback } from 'react';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { CalendarRange } from '../icons/ObsidianIcon';

interface KeyEventsCalendarButtonProps {
  plugin: JournalitPlugin;
  
  className: string;
}

export const KeyEventsCalendarButton: React.FC<
  KeyEventsCalendarButtonProps
> = ({ plugin, className }) => {
  const openCalendarView = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      
      event.stopPropagation();
      void plugin.viewManager.openEconomicCalendarView();
    },
    [plugin]
  );

  return (
    <button
      type="button"
      className={`journalit-native-button journalit-key-events-calendar-button ${className}`}
      onClick={openCalendarView}
      aria-label={t('widget.key-events.open-calendar-aria')}
    >
      <CalendarRange size={13} aria-hidden="true" />
    </button>
  );
};

KeyEventsCalendarButton.displayName = 'KeyEventsCalendarButton';
