import { t } from '../lang/helpers';
import { ECONOMIC_CALENDAR_VIEW_TYPE } from '../views/EconomicCalendarView';
import { GuideRegistry } from './GuideRegistry';
import {
  ECONOMIC_CALENDAR_FILTERS_TARGET_ID,
  ECONOMIC_CALENDAR_MAIN_GUIDE_ID,
  ECONOMIC_CALENDAR_MANUAL_IMPORT_TARGET_ID,
  ECONOMIC_CALENDAR_RESTORE_TARGET_ID,
  ECONOMIC_CALENDAR_SETTINGS_TARGET_ID,
} from './economicCalendarGuideIds';

export function registerEconomicCalendarMainGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ECONOMIC_CALENDAR_MAIN_GUIDE_ID,
    viewType: ECONOMIC_CALENDAR_VIEW_TYPE,
    version: 2,
    autoShow: true,
    
    
    resolvedByView: true,
    priority: 100,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('view.economic-calendar.title'),
        description: t('economicCalendar.guide.main.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'filters',
        title: t('economicCalendar.guide.main.filters.title'),
        description: t('economicCalendar.guide.main.filters.description'),
        progression: 'manual',
        targetId: ECONOMIC_CALENDAR_FILTERS_TARGET_ID,
        skipIfTargetMissing: false,
      },
      {
        id: 'settings',
        title: t('economicCalendar.guide.main.settings.title'),
        description: t('economicCalendar.guide.main.settings.description'),
        progression: 'manual',
        targetId: ECONOMIC_CALENDAR_SETTINGS_TARGET_ID,
        placement: 'left',
      },
      {
        id: 'manual-import',
        title: t('economicCalendar.guide.main.manual-import.title'),
        description: t('economicCalendar.guide.main.manual-import.description'),
        progression: 'manual',
        targetId: ECONOMIC_CALENDAR_MANUAL_IMPORT_TARGET_ID,
        skipIfTargetMissing: false,
      },
      {
        id: 'restore',
        title: t('economicCalendar.guide.main.restore.title'),
        description: t('economicCalendar.guide.main.restore.description'),
        progression: 'manual',
        targetId: ECONOMIC_CALENDAR_RESTORE_TARGET_ID,
        skipIfTargetMissing: false,
      },
      {
        id: 'summary',
        title: t('economicCalendar.guide.main.summary.title'),
        description: t('economicCalendar.guide.main.summary.description'),
        progression: 'manual',
        placement: 'center',
      },
    ],
  });
}
