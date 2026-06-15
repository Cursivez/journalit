

import React, { useState, useMemo, useEffect } from 'react';
import { Notice } from 'obsidian';
import JournalitPlugin from '../../../main';
import { Select } from '../../../components/core/Select';
import { ToggleSwitch } from '../../../components/ui';
import { ReviewTemplateService } from '../../../services/templates/ReviewTemplateService';
import { TradeTemplateService } from '../../../services/templates/TradeTemplateService';
import { Accordion } from '../../../components/shared/Accordion';
import { ItemManager } from '../shared/ItemManager';
import {
  eventBus,
  DefaultTemplateChangedPayload,
} from '../../../services/events';
import { t } from '../../../lang/helpers';
import {
  DEFAULT_SCALPER_DEFAULTS,
  DEFAULT_SETTINGS,
} from '../../../settings/types';
import {
  DemonTrackerCountMode,
  DemonTrackerSourceMode,
} from '../../../types/reviewV2';

interface ReviewsTabProps {
  plugin: JournalitPlugin;
}

const isDemonTrackerCountMode = (
  value: string
): value is DemonTrackerCountMode =>
  value === 'per-trade' || value === 'per-trading-day';

const isDemonTrackerSourceMode = (
  value: string
): value is DemonTrackerSourceMode =>
  value === 'trades' || value === 'session' || value === 'combined';

const getDefaultTemplateEventType = (
  type: keyof NonNullable<JournalitPlugin['settings']['templates']>
): DefaultTemplateChangedPayload['type'] => {
  switch (type) {
    case 'defaultDrc':
      return 'drc';
    case 'defaultWeekly':
      return 'weekly';
    case 'defaultMonthly':
      return 'monthly';
    case 'defaultQuarterly':
      return 'quarterly';
    case 'defaultYearly':
      return 'yearly';
    case 'defaultTrade':
    default:
      return 'trade';
  }
};

function useReviewsTabModel(props: ReviewsTabProps) {
  const { plugin } = props;
  
  const reviewTemplateService = useMemo(
    () => new ReviewTemplateService(plugin),
    [plugin]
  );
  const tradeTemplateService = useMemo(
    () => new TradeTemplateService(plugin),
    [plugin]
  );

  
  const drcTemplates = useMemo(
    () => reviewTemplateService.getTemplates('drc'),
    [reviewTemplateService]
  );
  const weeklyTemplates = useMemo(
    () => reviewTemplateService.getTemplates('weekly'),
    [reviewTemplateService]
  );
  const monthlyTemplates = useMemo(
    () => reviewTemplateService.getTemplates('monthly'),
    [reviewTemplateService]
  );
  const quarterlyTemplates = useMemo(
    () => reviewTemplateService.getTemplates('quarterly'),
    [reviewTemplateService]
  );
  const yearlyTemplates = useMemo(
    () => reviewTemplateService.getTemplates('yearly'),
    [reviewTemplateService]
  );
  const tradeTemplates = useMemo(
    () => tradeTemplateService.getTemplates(),
    [tradeTemplateService]
  );

  
  const [defaultTradeTemplate, setDefaultTradeTemplate] = useState(
    plugin.settings.templates?.defaultTrade ||
      tradeTemplates[0]?.id ||
      'builtin-trade-standard'
  );
  const [defaultDrcTemplate, setDefaultDrcTemplate] = useState(
    plugin.settings.templates?.defaultDrc ||
      drcTemplates[0]?.id ||
      'builtin-drc-standard'
  );
  const [defaultWeeklyTemplate, setDefaultWeeklyTemplate] = useState(
    plugin.settings.templates?.defaultWeekly ||
      weeklyTemplates[0]?.id ||
      'builtin-weekly-standard'
  );
  const [defaultMonthlyTemplate, setDefaultMonthlyTemplate] = useState(
    plugin.settings.templates?.defaultMonthly ||
      monthlyTemplates[0]?.id ||
      'builtin-monthly-standard'
  );
  const [defaultQuarterlyTemplate, setDefaultQuarterlyTemplate] = useState(
    plugin.settings.templates?.defaultQuarterly ||
      quarterlyTemplates[0]?.id ||
      'builtin-quarterly-standard'
  );
  const [defaultYearlyTemplate, setDefaultYearlyTemplate] = useState(
    plugin.settings.templates?.defaultYearly ||
      yearlyTemplates[0]?.id ||
      'builtin-yearly-standard'
  );

  
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
    if (plugin.settings.reviews?.globalAutoCreate === undefined) {
      if (!plugin.settings.reviews) {
        plugin.settings.reviews = { globalAutoCreate: true };
      } else {
        plugin.settings.reviews.globalAutoCreate = true;
      }
      return true;
    }
    return plugin.settings.reviews.globalAutoCreate;
  });

  
  const [settingsVersion, setSettingsVersion] = useState(0);
  void settingsVersion; 

  
  useEffect(() => {
    const handleDefaultChange = (payload: DefaultTemplateChangedPayload) => {
      const value = payload.value ?? '';
      switch (payload.type) {
        case 'trade':
          setDefaultTradeTemplate(value);
          break;
        case 'drc':
          setDefaultDrcTemplate(value);
          break;
        case 'weekly':
          setDefaultWeeklyTemplate(value);
          break;
        case 'monthly':
          setDefaultMonthlyTemplate(value);
          break;
        case 'quarterly':
          setDefaultQuarterlyTemplate(value);
          break;
        case 'yearly':
          setDefaultYearlyTemplate(value);
          break;
      }
    };

    return eventBus.subscribe('default-template:changed', handleDefaultChange);
  }, []);

  
  const tradeOptions = useMemo(
    () => tradeTemplates.map((t) => ({ value: t.id, label: t.name })),
    [tradeTemplates]
  );
  const drcOptions = useMemo(
    () => drcTemplates.map((t) => ({ value: t.id, label: t.name })),
    [drcTemplates]
  );
  const weeklyOptions = useMemo(
    () => weeklyTemplates.map((t) => ({ value: t.id, label: t.name })),
    [weeklyTemplates]
  );
  const monthlyOptions = useMemo(
    () => monthlyTemplates.map((t) => ({ value: t.id, label: t.name })),
    [monthlyTemplates]
  );
  const quarterlyOptions = useMemo(
    () => quarterlyTemplates.map((t) => ({ value: t.id, label: t.name })),
    [quarterlyTemplates]
  );
  const yearlyOptions = useMemo(
    () => yearlyTemplates.map((t) => ({ value: t.id, label: t.name })),
    [yearlyTemplates]
  );

  const demonCountModeOptions = useMemo(
    () => [
      {
        value: 'per-trade',
        label: t('templateEditor.widget.demon-tracker.count-mode.per-trade'),
      },
      {
        value: 'per-trading-day',
        label: t(
          'templateEditor.widget.demon-tracker.count-mode.per-trading-day'
        ),
      },
    ],
    []
  );

  const demonSourceModeOptions = useMemo(
    () => [
      {
        value: 'trades',
        label: t('templateEditor.widget.demon-tracker.source-mode.trades'),
      },
      {
        value: 'session',
        label: t('templateEditor.widget.demon-tracker.source-mode.session'),
      },
      {
        value: 'combined',
        label: t('templateEditor.widget.demon-tracker.source-mode.combined'),
      },
    ],
    []
  );

  const currentScalperDefaults =
    plugin.settings.reviewV2?.scalperDefaults ?? DEFAULT_SCALPER_DEFAULTS;

  const handleTemplateChange = async (
    type:
      | 'defaultTrade'
      | 'defaultDrc'
      | 'defaultWeekly'
      | 'defaultMonthly'
      | 'defaultQuarterly'
      | 'defaultYearly',
    value: string
  ) => {
    
    if (!plugin.settings.templates) {
      plugin.settings.templates = {
        defaultTrade: 'builtin-trade-standard',
        defaultDrc: 'builtin-drc-standard',
        defaultWeekly: 'builtin-weekly-standard',
        defaultMonthly: 'builtin-monthly-standard',
        defaultQuarterly: 'builtin-quarterly-standard',
        defaultYearly: 'builtin-yearly-standard',
      };
    }

    plugin.settings.templates[type] = value;
    await plugin.saveSettings();

    
    switch (type) {
      case 'defaultTrade':
        setDefaultTradeTemplate(value);
        break;
      case 'defaultDrc':
        setDefaultDrcTemplate(value);
        break;
      case 'defaultWeekly':
        setDefaultWeeklyTemplate(value);
        break;
      case 'defaultMonthly':
        setDefaultMonthlyTemplate(value);
        break;
      case 'defaultQuarterly':
        setDefaultQuarterlyTemplate(value);
        break;
      case 'defaultYearly':
        setDefaultYearlyTemplate(value);
        break;
    }

    
    
    const eventType = getDefaultTemplateEventType(type);
    eventBus.publish('default-template:changed', { type: eventType, value });

    new Notice(t('settings.reviews.notice.template-updated'));
  };

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

    
    if (plugin.settings.drc) {
      plugin.settings.drc.autoCreateOnFirstTrade = newValue;
    }
    if (plugin.settings.weekly) {
      plugin.settings.weekly.autoCreateOnFirstTrade = newValue;
    }
    if (plugin.settings.monthly) {
      plugin.settings.monthly.autoCreateOnFirstTrade = newValue;
    }
    if (plugin.settings.quarterly) {
      plugin.settings.quarterly.autoCreateOnFirstTrade = newValue;
    }
    if (plugin.settings.yearly) {
      plugin.settings.yearly.autoCreateOnFirstTrade = newValue;
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
        autoCreateOnFirstTrade: true,
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
        autoCreateOnFirstTrade: true,
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
        autoCreateOnFirstTrade: true,
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

  const ensureScalperDefaults = () => {
    if (!plugin.settings.reviewV2) {
      plugin.settings.reviewV2 = {
        customWidgetTypes: [],
        templates: [],
        tradeTemplates: [],
        scalperDefaults: { ...DEFAULT_SCALPER_DEFAULTS },
      };
    }

    if (!plugin.settings.reviewV2.scalperDefaults) {
      plugin.settings.reviewV2.scalperDefaults = {
        ...DEFAULT_SCALPER_DEFAULTS,
      };
    }

    return plugin.settings.reviewV2.scalperDefaults;
  };

  const handleScalperCountModeChange = async (value: string) => {
    if (!isDemonTrackerCountMode(value)) return;

    const scalperDefaults = ensureScalperDefaults();
    scalperDefaults.countMode = value;

    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);

    eventBus.publish('settings:changed', {
      component: 'reviewV2',
      settings: plugin.settings.reviewV2,
    });
  };

  const handleScalperSourceModeChange = async (value: string) => {
    if (!isDemonTrackerSourceMode(value)) return;

    const scalperDefaults = ensureScalperDefaults();
    scalperDefaults.sourceMode = value;

    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);

    eventBus.publish('settings:changed', {
      component: 'reviewV2',
      settings: plugin.settings.reviewV2,
    });
  };

  const handleScalperAutoApplyToggle = async (newValue: boolean) => {
    const scalperDefaults = ensureScalperDefaults();
    scalperDefaults.autoApplySessionMistakesToTrades = newValue;

    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);

    eventBus.publish('settings:changed', {
      component: 'reviewV2',
      settings: plugin.settings.reviewV2,
    });
  };

  return {
    checklistItems,
    currentScalperDefaults,
    defaultDrcTemplate,
    defaultMonthlyTemplate,
    defaultQuarterlyTemplate,
    defaultTradeTemplate,
    defaultWeeklyTemplate,
    defaultYearlyTemplate,
    demonCountModeOptions,
    demonSourceModeOptions,
    drcOptions,
    globalAutoCreate,
    handleAutoCreateDRCOnNavigationToggle,
    handleAutoCreateMonthlyReviewOnNavigationToggle,
    handleAutoCreateQuarterlyReviewOnNavigationToggle,
    handleAutoCreateWeeklyReviewOnNavigationToggle,
    handleAutoCreateYearlyReviewOnNavigationToggle,
    handleGlobalAutoCreateToggle,
    handleOpenBuilder,
    handleScalperAutoApplyToggle,
    handleScalperCountModeChange,
    handleScalperSourceModeChange,
    handleTemplateChange,
    monthlyOptions,
    plugin,
    quarterlyOptions,
    recurringGoals,
    setChecklistItems,
    setRecurringGoals,
    setWeeklyChecklistItems,
    setWeeklyRecurringGoals,
    tradeOptions,
    weeklyChecklistItems,
    weeklyOptions,
    weeklyRecurringGoals,
    yearlyOptions,
  };
}

type ReviewsTabModel = ReturnType<typeof useReviewsTabModel>;

function DefaultTemplatesSection({
  defaultTradeTemplate,
  defaultDrcTemplate,
  defaultWeeklyTemplate,
  defaultMonthlyTemplate,
  defaultQuarterlyTemplate,
  defaultYearlyTemplate,
  tradeOptions,
  drcOptions,
  weeklyOptions,
  monthlyOptions,
  quarterlyOptions,
  yearlyOptions,
  handleTemplateChange,
}: Pick<
  ReviewsTabModel,
  | 'defaultTradeTemplate'
  | 'defaultDrcTemplate'
  | 'defaultWeeklyTemplate'
  | 'defaultMonthlyTemplate'
  | 'defaultQuarterlyTemplate'
  | 'defaultYearlyTemplate'
  | 'tradeOptions'
  | 'drcOptions'
  | 'weeklyOptions'
  | 'monthlyOptions'
  | 'quarterlyOptions'
  | 'yearlyOptions'
  | 'handleTemplateChange'
>) {
  return (
    <div className="templates-defaults-section">
      <h4>{t('settings.reviews.default-templates')}</h4>
      <p className="setting-item-description">
        {t('settings.reviews.default-templates-desc')}
      </p>

      {(
        [
          [
            'trade-template',
            'trade-template-desc',
            'defaultTrade',
            defaultTradeTemplate,
            tradeOptions,
          ],
          [
            'drc-template',
            'drc-template-desc',
            'defaultDrc',
            defaultDrcTemplate,
            drcOptions,
          ],
          [
            'weekly-template',
            'weekly-template-desc',
            'defaultWeekly',
            defaultWeeklyTemplate,
            weeklyOptions,
          ],
          [
            'monthly-template',
            'monthly-template-desc',
            'defaultMonthly',
            defaultMonthlyTemplate,
            monthlyOptions,
          ],
          [
            'quarterly-template',
            'quarterly-template-desc',
            'defaultQuarterly',
            defaultQuarterlyTemplate,
            quarterlyOptions,
          ],
          [
            'yearly-template',
            'yearly-template-desc',
            'defaultYearly',
            defaultYearlyTemplate,
            yearlyOptions,
          ],
        ] as const
      ).map(([nameKey, descKey, templateKey, value, options]) => (
        <div className="setting-item" key={templateKey}>
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t(`settings.reviews.${nameKey}`)}
            </div>
            <div className="setting-item-description">
              {t(`settings.reviews.${descKey}`)}
            </div>
          </div>
          <div className="setting-item-control">
            <Select
              value={value}
              onChange={(nextValue) =>
                handleTemplateChange(templateKey, nextValue)
              }
              options={options}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

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
    currentScalperDefaults,
    defaultDrcTemplate,
    defaultMonthlyTemplate,
    defaultQuarterlyTemplate,
    defaultTradeTemplate,
    defaultWeeklyTemplate,
    defaultYearlyTemplate,
    demonCountModeOptions,
    demonSourceModeOptions,
    drcOptions,
    globalAutoCreate,
    handleAutoCreateDRCOnNavigationToggle,
    handleAutoCreateMonthlyReviewOnNavigationToggle,
    handleAutoCreateQuarterlyReviewOnNavigationToggle,
    handleAutoCreateWeeklyReviewOnNavigationToggle,
    handleAutoCreateYearlyReviewOnNavigationToggle,
    handleGlobalAutoCreateToggle,
    handleOpenBuilder,
    handleScalperAutoApplyToggle,
    handleScalperCountModeChange,
    handleScalperSourceModeChange,
    handleTemplateChange,
    monthlyOptions,
    plugin,
    quarterlyOptions,
    recurringGoals,
    setChecklistItems,
    setRecurringGoals,
    setWeeklyChecklistItems,
    setWeeklyRecurringGoals,
    tradeOptions,
    weeklyChecklistItems,
    weeklyOptions,
    weeklyRecurringGoals,
    yearlyOptions,
  } = useReviewsTabModel(props);

  return (
    <div className="journalit-settings-tab templates-settings">
      <DefaultTemplatesSection
        defaultTradeTemplate={defaultTradeTemplate}
        defaultDrcTemplate={defaultDrcTemplate}
        defaultWeeklyTemplate={defaultWeeklyTemplate}
        defaultMonthlyTemplate={defaultMonthlyTemplate}
        defaultQuarterlyTemplate={defaultQuarterlyTemplate}
        defaultYearlyTemplate={defaultYearlyTemplate}
        tradeOptions={tradeOptions}
        drcOptions={drcOptions}
        weeklyOptions={weeklyOptions}
        monthlyOptions={monthlyOptions}
        quarterlyOptions={quarterlyOptions}
        yearlyOptions={yearlyOptions}
        handleTemplateChange={handleTemplateChange}
      />

      <hr />

      
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

      
      <Accordion
        title={t('settings.reviews.scalper-defaults')}
        defaultExpanded={false}
      >
        <p className="setting-item-description journalit-u-mb-12">
          {t('settings.reviews.scalper-defaults-desc')}
        </p>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.scalper-default-count-mode')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.scalper-default-count-mode-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <Select
              value={currentScalperDefaults.countMode}
              onChange={handleScalperCountModeChange}
              options={demonCountModeOptions}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.scalper-default-source-mode')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.scalper-default-source-mode-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <Select
              value={currentScalperDefaults.sourceMode}
              onChange={handleScalperSourceModeChange}
              options={demonSourceModeOptions}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.reviews.scalper-auto-apply-session')}
            </div>
            <div className="setting-item-description">
              {t('settings.reviews.scalper-auto-apply-session-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={
                currentScalperDefaults.autoApplySessionMistakesToTrades ?? false
              }
              onChange={handleScalperAutoApplyToggle}
              id="scalper-auto-apply-session-toggle"
              ariaLabel={t('settings.reviews.scalper-auto-apply-session-aria')}
            />
          </div>
        </div>
      </Accordion>
    </div>
  );
};
