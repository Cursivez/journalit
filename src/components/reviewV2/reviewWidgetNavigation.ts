import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { openCanonicalReviewIfAllowed } from '../../utils/reviewNavigation';

export interface ReviewWidgetNavigationHost {
  settings: Pick<JournalitPlugin['settings'], 'reviewV2'>;
  openFile: JournalitPlugin['openFile'];
}

export function shouldOpenReviewWidgetNotesInNewTab(
  plugin: ReviewWidgetNavigationHost
): boolean {
  return plugin.settings.reviewV2?.openNoteLinksInNewTab ?? true;
}

export async function openReviewWidgetFile(
  plugin: ReviewWidgetNavigationHost,
  path: string
): Promise<void> {
  await plugin.openFile(path, shouldOpenReviewWidgetNotesInNewTab(plugin));
}

type ReviewWidgetPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export function getReviewWidgetPeriodAriaLabel(
  period: ReviewWidgetPeriod,
  label: string
): string {
  switch (period) {
    case 'daily':
      return t('calendar.aria.open-daily-review', { date: label });
    case 'weekly':
      return t('calendar.aria.open-weekly-review', { date: label });
    case 'monthly':
      return t('calendar.aria.open-monthly-review', { date: label });
    case 'quarterly':
      return t('calendar.aria.open-quarterly-review', { date: label });
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}


export async function openReviewWidgetPeriod(
  plugin: JournalitPlugin,
  period: ReviewWidgetPeriod,
  date: Date
): Promise<void> {
  const createNewLeaf = shouldOpenReviewWidgetNotesInNewTab(plugin);

  switch (period) {
    case 'daily': {
      await openCanonicalReviewIfAllowed({
        plugin,
        autoCreate: plugin.settings.drc.autoCreateDRCOnNavigation ?? true,
        getService: () => plugin.serviceManager.getDRCService(),
        getPath: (service) => service.getDRCNotePath(date),
        open: (service) =>
          service.openDRC(date, createNewLeaf, true, 'standard'),
      });
      return;
    }
    case 'weekly': {
      await openCanonicalReviewIfAllowed({
        plugin,
        autoCreate:
          plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation ?? true,
        getService: () => plugin.serviceManager.getWeeklyReviewService(),
        getPath: (service) => service.getWeeklyReviewPath(date),
        open: (service) =>
          service.openWeeklyReview(date, createNewLeaf, true, 'standard'),
      });
      return;
    }
    case 'monthly': {
      await openCanonicalReviewIfAllowed({
        plugin,
        autoCreate:
          plugin.settings.monthly?.autoCreateMonthlyReviewOnNavigation ?? true,
        getService: () => plugin.serviceManager.getMonthlyReviewService(),
        getPath: (service) => service.getMonthlyReviewPath(date),
        open: (service) =>
          service.openMonthlyReview(date, createNewLeaf, true, 'standard'),
      });
      return;
    }
    case 'quarterly': {
      await openCanonicalReviewIfAllowed({
        plugin,
        autoCreate:
          plugin.settings.quarterly?.autoCreateQuarterlyReviewOnNavigation ??
          true,
        getService: () => plugin.serviceManager.getQuarterlyReviewService(),
        getPath: (service) => service.getQuarterlyReviewPath(date),
        open: (service) =>
          service.openQuarterlyReview(date, createNewLeaf, true, 'standard'),
      });
    }
  }
}
