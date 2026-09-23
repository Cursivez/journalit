

import React, { useState } from 'react';
import { Notice } from 'obsidian';
import JournalitPlugin from '../../../main';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { Accordion } from '../../../components/shared/Accordion';
import { ItemManager } from '../shared/ItemManager';
import { eventBus } from '../../../services/events/EventBus';
import { t } from '../../../lang/helpers';
import { DEFAULT_SETTINGS } from '../../../settings/types';

interface ReviewsTabProps {
  plugin: JournalitPlugin;
}

function useReviewsTabModel(props: ReviewsTabProps) {
  const { plugin } = props;

  const [recurringGoals, setRecurringGoals] = useState<string[]>(
    plugin.settings.drc?.recurringGoals || []
  );
  const [weeklyRecurringGoals, setWeeklyRecurringGoals] = useState<string[]>(
    plugin.settings.weekly?.recurringGoals || []
  );
  const [checklistItems, setChecklistItems] = useState<string[]>(
    plugin.settings.drc?.checklistItems || []
  );
  const [weeklyChecklistItems, setWeeklyChecklistItems] = useState<string[]>(
    plugin.settings.weekly?.checklistItems || []
  );
  const [globalAutoCreate, setGlobalAutoCreate] = useState(() => {
    return plugin.settings.reviews?.globalAutoCreate ?? true;
  });
  const [settingsVersion, setSettingsVersion] = useState(0);
  void settingsVersion; 

  const handleOpenBuilder = () => {
    
    const commands = plugin.app.commands;
    if (commands?.executeCommandById) {
      commands.executeCommandById('journalit:open-layout-builder');
    } else {
      new Notice(t('settings.reviews.notice.builder-not-found'));
    }
  };

  
  const handleGlobalAutoCreateToggle = async () => {
    const newValue = !globalAutoCreate;
    setGlobalAutoCreate(newValue);

    if (!plugin.settings.reviews) {
      plugin.settings.reviews = { globalAutoCreate: newValue };
    } else {
      plugin.settings.reviews.globalAutoCreate = newValue;
    }

    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);

    eventBus.publish('settings:changed', {
      component: 'reviews',
      settings: plugin.settings.reviews,
    });

    new Notice(
      t('settings.reviews.notice.global-auto-create', {
        status: newValue ? t('common.enabled') : t('common.disabled'),
      })
    );
  };

  
  const handleAutoCreateDRCOnNavigationToggle = async (newValue: boolean) => {
    plugin.settings.drc.autoCreateDRCOnNavigation = newValue;
    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.reviews.notice.auto-create-nav', {
        type: t('settings.reviews.drc'),
        status: newValue ? t('common.enabled') : t('common.disabled'),
      })
    );
  };

  
  const handleAutoCreateWeeklyReviewOnNavigationToggle = async (
    newValue: boolean
  ) => {
    plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation = newValue;
    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.reviews.notice.auto-create-nav', {
        type: t('settings.reviews.weekly'),
        status: newValue ? t('common.enabled') : t('common.disabled'),
      })
    );
  };

  
  const handleAutoCreateMonthlyReviewOnNavigationToggle = async (
    newValue: boolean
  ) => {
    if (!plugin.settings.monthly) {
      plugin.settings.monthly = {
        reviewQuestions: [],
        customTimeframes: [],
        autoCreateMonthlyReviewOnNavigation: newValue,
      };
    } else {
      plugin.settings.monthly.autoCreateMonthlyReviewOnNavigation = newValue;
    }

    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.reviews.notice.auto-create-nav', {
        type: t('settings.reviews.monthly'),
        status: newValue ? t('common.enabled') : t('common.disabled'),
      })
    );
  };

  
  const handleAutoCreateQuarterlyReviewOnNavigationToggle = async (
    newValue: boolean
  ) => {
    if (!plugin.settings.quarterly) {
      plugin.settings.quarterly = {
        reviewQuestions: [],
        customTimeframes: [],
        autoCreateQuarterlyReviewOnNavigation: newValue,
      };
    } else {
      plugin.settings.quarterly.autoCreateQuarterlyReviewOnNavigation =
        newValue;
    }

    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.reviews.notice.auto-create-nav', {
        type: t('settings.reviews.quarterly'),
        status: newValue ? t('common.enabled') : t('common.disabled'),
      })
    );
  };

  
  const handleAutoCreateYearlyReviewOnNavigationToggle = async (
    newValue: boolean
  ) => {
    if (!plugin.settings.yearly) {
      plugin.settings.yearly = {
        reviewQuestions: [],
        customTimeframes: [],
        autoCreateYearlyReviewOnNavigation: newValue,
      };
    } else {
      plugin.settings.yearly.autoCreateYearlyReviewOnNavigation = newValue;
    }

    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.reviews.notice.auto-create-nav', {
        type: t('settings.reviews.yearly'),
        status: newValue ? t('common.enabled') : t('common.disabled'),
      })
    );
  };

  return {
    checklistItems,
    globalAutoCreate,
    handleAutoCreateDRCOnNavigationToggle,
    handleAutoCreateMonthlyReviewOnNavigationToggle,
    handleAutoCreateQuarterlyReviewOnNavigationToggle,
    handleAutoCreateWeeklyReviewOnNavigationToggle,
    handleAutoCreateYearlyReviewOnNavigationToggle,
    handleGlobalAutoCreateToggle,
    handleOpenBuilder,
    plugin,
    recurringGoals,
    setChecklistItems,
    setRecurringGoals,
    setWeeklyChecklistItems,
    setWeeklyRecurringGoals,
    weeklyChecklistItems,
    weeklyRecurringGoals,
  };
}

type ReviewsTabModel = ReturnType<typeof useReviewsTabModel>;

function ReviewListsSection({
  plugin,
  recurringGoals,
  weeklyRecurringGoals,
  checklistItems,
  weeklyChecklistItems,
  setRecurringGoals,
  setWeeklyRecurringGoals,
  setChecklistItems,
  setWeeklyChecklistItems,
}: Pick<
  ReviewsTabModel,
  | 'plugin'
  | 'recurringGoals'
  | 'weeklyRecurringGoals'
  | 'checklistItems'
  | 'weeklyChecklistItems'
  | 'setRecurringGoals'
  | 'setWeeklyRecurringGoals'
  | 'setChecklistItems'
  | 'setWeeklyChecklistItems'
>) {
  return (
    <>
      <Accordion
        title={t('settings.reviews.recurring-goals')}
        defaultExpanded={false}
      >
        <p className="setting-item-description journalit-u-mb-12">
          {t('settings.reviews.recurring-goals-desc')}
        </p>
        <h5 className="journalit-u-mt-16 journalit-u-mb-8 journalit-u-text-muted">
          {t('settings.reviews.daily-goals')}
        </h5>
        <ItemManager
          plugin={plugin}
          items={recurringGoals}
          defaultItems={[]}
          settingsPath="drc.recurringGoals"
          placeholder={t('settings.reviews.daily-goal-placeholder')}
          onItemsChange={setRecurringGoals}
          settingsEventComponent="drc"
        />
        <h5 className="journalit-u-mt-16 journalit-u-mb-8 journalit-u-text-muted">
          {t('settings.reviews.weekly-goals')}
        </h5>
        <ItemManager
          plugin={plugin}
          items={weeklyRecurringGoals}
          defaultItems={[]}
          settingsPath="weekly.recurringGoals"
          placeholder={t('settings.reviews.weekly-goal-placeholder')}
          onItemsChange={setWeeklyRecurringGoals}
          settingsEventComponent="weekly"
        />
      </Accordion>

      <Accordion
        title={t('settings.reviews.pre-trade-checklist')}
        defaultExpanded={false}
      >
        <p className="setting-item-description journalit-u-mb-12">
          {t('settings.reviews.pre-trade-checklist-desc')}
        </p>
        <ItemManager
          plugin={plugin}
          items={checklistItems}
          defaultItems={[]}
          settingsPath="drc.checklistItems"
          placeholder={t('settings.reviews.checklist-placeholder')}
          onItemsChange={setChecklistItems}
          settingsEventComponent="drc"
        />
      </Accordion>

      <Accordion
        title={t('settings.reviews.weekly-checklist')}
        defaultExpanded={false}
      >
        <p className="setting-item-description journalit-u-mb-12">
          {t('settings.reviews.weekly-checklist-desc')}
        </p>
        <ItemManager
          plugin={plugin}
          items={weeklyChecklistItems}
          defaultItems={DEFAULT_SETTINGS.weekly.checklistItems || []}
          settingsPath="weekly.checklistItems"
          placeholder={t('settings.reviews.weekly-checklist-placeholder')}
          onItemsChange={setWeeklyChecklistItems}
          settingsEventComponent="weekly"
        />
      </Accordion>
    </>
  );
}

export const ReviewsTab: React.FC<ReviewsTabProps> = (props) => {
  const {
    checklistItems,
    globalAutoCreate,
    handleAutoCreateDRCOnNavigationToggle,
    handleAutoCreateMonthlyReviewOnNavigationToggle,
    handleAutoCreateQuarterlyReviewOnNavigationToggle,
    handleAutoCreateWeeklyReviewOnNavigationToggle,
    handleAutoCreateYearlyReviewOnNavigationToggle,
    handleGlobalAutoCreateToggle,
    handleOpenBuilder,
    plugin,
    recurringGoals,
    setChecklistItems,
    setRecurringGoals,
    setWeeklyChecklistItems,
    setWeeklyRecurringGoals,
    weeklyChecklistItems,
    weeklyRecurringGoals,
  } = useReviewsTabModel(props);

  return (
    <div className="journalit-settings-tab templates-settings">
      
      <div className="template-builder-section">
        <h4>{t('settings.reviews.template-builder')}</h4>
        <p className="setting-item-description">
          {t('settings.reviews.template-builder-desc')}
        </p>

        <button
          className="mod-cta journalit-u-mt-12"
          onClick={handleOpenBuilder}
        >
          {t('settings.reviews.open-builder')}
        </button>
      </div>

      <hr />

      <ReviewListsSection
        plugin={plugin}
        recurringGoals={recurringGoals}
        weeklyRecurringGoals={weeklyRecurringGoals}
        checklistItems={checklistItems}
        weeklyChecklistItems={weeklyChecklistItems}
        setRecurringGoals={setRecurringGoals}
        setWeeklyRecurringGoals={setWeeklyRecurringGoals}
        setChecklistItems={setChecklistItems}
        setWeeklyChecklistItems={setWeeklyChecklistItems}
      />

      
      <Accordion
        title={t('settings.reviews.auto-create')}
        defaultExpanded={false}
      >
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.global-auto-create')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.global-auto-create-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={globalAutoCreate}
              onChange={handleGlobalAutoCreateToggle}
              id="global-auto-create-toggle"
              ariaLabel={t('settings.reviews.global-auto-create-aria')}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.auto-create-drc-nav')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.auto-create-drc-nav-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={plugin.settings.drc.autoCreateDRCOnNavigation ?? true}
              onChange={handleAutoCreateDRCOnNavigationToggle}
              id="auto-create-drc-navigation-toggle"
              ariaLabel={t('settings.reviews.auto-create-drc-nav-aria')}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.auto-create-weekly-nav')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.auto-create-weekly-nav-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={
                plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation ??
                true
              }
              onChange={handleAutoCreateWeeklyReviewOnNavigationToggle}
              id="auto-create-weekly-review-navigation-toggle"
              ariaLabel={t('settings.reviews.auto-create-weekly-nav-aria')}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.auto-create-monthly-nav')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.auto-create-monthly-nav-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={
                plugin.settings.monthly?.autoCreateMonthlyReviewOnNavigation ??
                true
              }
              onChange={handleAutoCreateMonthlyReviewOnNavigationToggle}
              id="auto-create-monthly-review-navigation-toggle"
              ariaLabel={t('settings.reviews.auto-create-monthly-nav-aria')}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.auto-create-quarterly-nav')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.auto-create-quarterly-nav-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={
                plugin.settings.quarterly
                  ?.autoCreateQuarterlyReviewOnNavigation ?? true
              }
              onChange={handleAutoCreateQuarterlyReviewOnNavigationToggle}
              id="auto-create-quarterly-review-navigation-toggle"
              ariaLabel={t('settings.reviews.auto-create-quarterly-nav-aria')}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.auto-create-yearly-nav')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.auto-create-yearly-nav-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={
                plugin.settings.yearly?.autoCreateYearlyReviewOnNavigation ??
                true
              }
              onChange={handleAutoCreateYearlyReviewOnNavigationToggle}
              id="auto-create-yearly-review-navigation-toggle"
              ariaLabel={t('settings.reviews.auto-create-yearly-nav-aria')}
            />
          </div>
        </div>
      </Accordion>
    </div>
  );
};
