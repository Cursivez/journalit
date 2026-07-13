

import React, { useState } from 'react';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { ReviewsTab } from '../reviews/ReviewsTab';
import { CustomizationTab } from '../customization/CustomizationTab';
import { SessionModeTab } from '../sessionMode/SessionModeTab';

interface JournalSettingsTabProps {
  plugin: JournalitPlugin;
  initialSection?: JournalSettingsSection;
}

type JournalSettingsSection = 'reviews' | 'fields' | 'sessionMode';

export const JournalSettingsTab: React.FC<JournalSettingsTabProps> = ({
  plugin,
  initialSection = 'reviews',
}) => {
  const [sectionState, setSectionState] = useState(() => ({
    initialSection,
    activeSection: initialSection,
  }));
  const activeSection =
    sectionState.initialSection === initialSection
      ? sectionState.activeSection
      : initialSection;

  const selectSection = (section: JournalSettingsSection) => {
    setSectionState({ initialSection, activeSection: section });
  };

  return (
    <div className="journalit-settings-tab journal-settings">
      <nav className="settings-tab-nav journalit-settings-subnav">
        <button
          type="button"
          className={`journalit-button journalit-settings-tab-button settings-tab-button ${activeSection === 'reviews' ? 'settings-tab-button--active' : ''}`}
          onClick={() => selectSection('reviews')}
        >
          {t('settings.tab.reviews')}
        </button>
        <button
          type="button"
          className={`journalit-button journalit-settings-tab-button settings-tab-button ${activeSection === 'fields' ? 'settings-tab-button--active' : ''}`}
          onClick={() => selectSection('fields')}
        >
          {t('settings.tab.customization')}
        </button>
        <button
          type="button"
          className={`journalit-button journalit-settings-tab-button settings-tab-button ${activeSection === 'sessionMode' ? 'settings-tab-button--active' : ''}`}
          onClick={() => selectSection('sessionMode')}
        >
          {t('settings.session-mode.title')}
        </button>
      </nav>

      {activeSection === 'reviews' && <ReviewsTab plugin={plugin} />}
      {activeSection === 'fields' && <CustomizationTab plugin={plugin} />}
      {activeSection === 'sessionMode' && <SessionModeTab plugin={plugin} />}
    </div>
  );
};

JournalSettingsTab.displayName = 'JournalSettingsTab';
