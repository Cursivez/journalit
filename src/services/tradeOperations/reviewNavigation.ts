import { TFile, normalizePath } from 'obsidian';
import type JournalitPlugin from '../../main';
import {
  formatLocalDateString,
  getISOWeekThursday,
  getQuarter,
  getWeekAnchorDate,
  getWeekStartDaySetting,
  getWeekStringForDate,
} from '../../utils/dateUtils';
import type { ReviewPeriodLevel } from './periodGrouping';

type ReviewNavigationOutcome = 'opened' | 'creation-disabled' | 'failed';

function asFrontmatterRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;
}

function fileMatchesReviewPeriod(
  plugin: JournalitPlugin,
  file: TFile,
  level: ReviewPeriodLevel,
  anchorDate: Date,
  canonicalPath: string
): boolean {
  if (normalizePath(file.path) === normalizePath(canonicalPath)) {
    return true;
  }

  const frontmatter = asFrontmatterRecord(
    plugin.app.metadataCache.getFileCache(file)?.frontmatter
  );
  if (!frontmatter) return false;

  switch (level) {
    case 'days':
      return (
        frontmatter.type === 'drc' &&
        frontmatter.date === formatLocalDateString(anchorDate)
      );
    case 'weeks': {
      const weekAnchor = getWeekAnchorDate(
        anchorDate,
        getWeekStartDaySetting(plugin)
      );
      const weekAnchorThursday = getISOWeekThursday(weekAnchor);
      return (
        frontmatter.type === 'weekly-review' &&
        frontmatter.week === getWeekStringForDate(weekAnchor) &&
        frontmatter.month ===
          String(weekAnchorThursday.getMonth() + 1).padStart(2, '0') &&
        frontmatter.year === String(weekAnchorThursday.getFullYear())
      );
    }
    case 'months':
      return (
        frontmatter.type === 'monthly-review' &&
        Number(frontmatter.month) === anchorDate.getMonth() + 1 &&
        Number(frontmatter.year) === anchorDate.getFullYear()
      );
    case 'quarters':
      return (
        frontmatter.type === 'quarterly-review' &&
        Number(frontmatter.quarter) === getQuarter(anchorDate) &&
        Number(frontmatter.year) === anchorDate.getFullYear()
      );
    case 'years':
      return (
        frontmatter.type === 'yearly-review' &&
        Number(frontmatter.year) === anchorDate.getFullYear()
      );
  }
}

function hasOpenReviewPeriod(
  plugin: JournalitPlugin,
  level: ReviewPeriodLevel,
  anchorDate: Date,
  canonicalPath: string
): boolean {
  let found = false;
  plugin.app.workspace.iterateAllLeaves((leaf) => {
    const file = 'file' in leaf.view ? leaf.view.file : null;
    if (
      file instanceof TFile &&
      fileMatchesReviewPeriod(plugin, file, level, anchorDate, canonicalPath)
    ) {
      found = true;
    }
  });
  return found;
}

function activeFileMatchesReviewPeriod(
  plugin: JournalitPlugin,
  level: ReviewPeriodLevel,
  anchorDate: Date,
  canonicalPath: string
): boolean {
  const activeFile = plugin.app.workspace.getActiveFile();
  return activeFile
    ? fileMatchesReviewPeriod(
        plugin,
        activeFile,
        level,
        anchorDate,
        canonicalPath
      )
    : false;
}

function canCreateReview(
  plugin: JournalitPlugin,
  level: ReviewPeriodLevel
): boolean {
  switch (level) {
    case 'days':
      return plugin.settings.drc.autoCreateDRCOnNavigation ?? true;
    case 'weeks':
      return plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation ?? true;
    case 'months':
      return (
        plugin.settings.monthly?.autoCreateMonthlyReviewOnNavigation ?? true
      );
    case 'quarters':
      return (
        plugin.settings.quarterly?.autoCreateQuarterlyReviewOnNavigation ?? true
      );
    case 'years':
      return plugin.settings.yearly?.autoCreateYearlyReviewOnNavigation ?? true;
  }
}

export async function openReviewPeriod(
  plugin: JournalitPlugin,
  level: ReviewPeriodLevel,
  anchorDate: Date,
  options: { createNewLeaf?: boolean } = {}
): Promise<ReviewNavigationOutcome> {
  try {
    const serviceManager = plugin.serviceManager;
    const createNewLeaf = options.createNewLeaf ?? true;
    let reviewPath: string;
    let open: () => Promise<void>;
    switch (level) {
      case 'days': {
        const service = await serviceManager.getDRCService();
        reviewPath = service.getDRCNotePath(anchorDate);
        open = () =>
          service.openDRC(anchorDate, createNewLeaf, true, 'standard');
        break;
      }
      case 'weeks': {
        const service = await serviceManager.getWeeklyReviewService();
        reviewPath = service.getWeeklyReviewPath(anchorDate);
        open = () =>
          service.openWeeklyReview(anchorDate, createNewLeaf, true, 'standard');
        break;
      }
      case 'months': {
        const service = await serviceManager.getMonthlyReviewService();
        reviewPath = service.getMonthlyReviewPath(anchorDate);
        open = () =>
          service.openMonthlyReview(
            anchorDate,
            createNewLeaf,
            true,
            'standard'
          );
        break;
      }
      case 'quarters': {
        const service = await serviceManager.getQuarterlyReviewService();
        reviewPath = await service.getQuarterlyReviewPath(anchorDate);
        open = () =>
          service.openQuarterlyReview(
            anchorDate,
            createNewLeaf,
            true,
            'standard'
          );
        break;
      }
      case 'years': {
        const service = await serviceManager.getYearlyReviewService();
        reviewPath = await service.getYearlyReviewPath(anchorDate);
        open = () =>
          service.openYearlyReview(anchorDate, createNewLeaf, true, 'standard');
        break;
      }
    }

    const exists = await plugin.app.vault.adapter.exists(reviewPath);
    if (
      !exists &&
      !hasOpenReviewPeriod(plugin, level, anchorDate, reviewPath) &&
      !canCreateReview(plugin, level)
    ) {
      return 'creation-disabled';
    }
    await open();
    if (!activeFileMatchesReviewPeriod(plugin, level, anchorDate, reviewPath)) {
      throw new Error(
        `Review navigation did not activate the requested file: ${reviewPath}`
      );
    }
    return 'opened';
  } catch (error) {
    console.error('[ReviewNavigation] Failed to open review period:', error);
    return 'failed';
  }
}
