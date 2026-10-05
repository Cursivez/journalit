

import type { JournalitSettings } from '../../../settings/types';
import { DEFAULT_SETTINGS } from '../../../settings/types';
import { AccountType, DrawdownType } from '../../account/types';
import { AVAILABLE_HOME_WIDGETS } from '../../../components/home/homeTypes';
import {
  buildHomeLayouts,
  HOME_LAYOUT_BREAKPOINTS,
  type HomeDefaultWidgetId,
  type HomeWidgetPlacement,
} from '../../../components/home/defaultHomeLayout';
import { normalizeLayoutForSave } from '../../../components/shared/gridLayout/gridLayoutUtils';
import type { CurrentStreakKind } from '../../../settings/types';
import type { OnboardingAnswers } from '../types';
import { LEGACY_DEFAULT_HOME_LAYOUT } from './legacyHomeLayout';

export type PersonalisationLever =
  | 'homeWidgets'
  | 'homeQuickLinks'
  | 'navigation'
  | 'tradeForm'
  | 'positionSize'
  | 'tradeCapture'
  | 'notifications'
  | 'reviews'
  | 'accounts';

interface PersonalisationChange {
  lever: PersonalisationLever;
  
  apply: (settings: JournalitSettings) => void;
}

const DEFAULT_HOME = DEFAULT_SETTINGS.home;

const isDefaultHomeLayout = (settings: JournalitSettings): boolean => {
  const home = settings.home;
  const defaultLayout = DEFAULT_HOME?.layouts.Default;
  if (!home || !defaultLayout) return false;
  const activeLayout = home.activeLayout || 'Default';
  const layout = home.layouts[activeLayout];
  if (!layout || activeLayout !== 'Default') return false;
  return [defaultLayout, LEGACY_DEFAULT_HOME_LAYOUT].some((candidate) =>
    HOME_LAYOUT_BREAKPOINTS.every(
      (breakpoint) =>
        JSON.stringify(normalizeLayoutForSave(layout[breakpoint] ?? [])) ===
        JSON.stringify(normalizeLayoutForSave(candidate[breakpoint] ?? []))
    )
  );
};

interface HomePlan {
  
  widgets: HomeDefaultWidgetId[];
  streakKind?: CurrentStreakKind;
  goal?: { type: 'tradesJournaled'; target: number };
}

const homePlanFor = (answers: OnboardingAnswers): HomePlan => {
  const base: HomePlan = { widgets: ['gettingStarted', 'yearHeatmap'] };
  switch (answers.tradingStyle) {
    case 'scalping':
      base.widgets.push('weeklySummary', 'bestHours', 'currentStreak');
      base.streakKind = 'drc-review';
      break;
    case 'intraday':
      base.widgets.push(
        'unreviewedTrades',
        'weeklySummary',
        'bestHours',
        'currentStreak'
      );
      base.streakKind = 'trade-review';
      break;
    case 'swing':
      base.widgets.push('unreviewedTrades', 'weeklySummary', 'currentStreak');
      base.streakKind = 'weekly-review';
      break;
    case 'position':
      base.widgets.push('unreviewedTrades', 'weeklySummary', 'currentStreak');
      base.streakKind = 'monthly-review';
      break;
    default:
      base.widgets.push('unreviewedTrades', 'weeklySummary');
  }
  switch (answers.accountKind) {
    case 'prop':
      base.widgets.push('drawdownMonitor', 'profitTarget');
      break;
    case 'practice':
      base.widgets.push('goalsProgress');
      base.goal = { type: 'tradesJournaled', target: 30 };
      break;
  }
  base.widgets.push('positionSize', 'recentItems');
  return base;
};

const setQuickLinkVisibility = (
  settings: JournalitSettings,
  visibility: Record<string, boolean>
): void => {
  for (const link of settings.home?.quickLinks ?? []) {
    const next = visibility[link.id];
    if (next !== undefined) link.visible = next;
  }
};

const moveQuickLinkAfter = (
  settings: JournalitSettings,
  id: string,
  afterId: string
): void => {
  const links = [...(settings.home?.quickLinks ?? [])].sort(
    (a, b) => a.order - b.order
  );
  const moving = links.find((link) => link.id === id);
  const anchor = links.find((link) => link.id === afterId);
  if (!moving || !anchor) return;
  const without = links.filter((link) => link.id !== id);
  const anchorIndex = without.findIndex((link) => link.id === afterId);
  without.splice(anchorIndex + 1, 0, moving);
  without.forEach((link, index) => {
    link.order = index;
  });
};

const setNavItemVisibility = (
  settings: JournalitSettings,
  visibility: Record<string, boolean>
): void => {
  for (const item of settings.navigation?.items ?? []) {
    const next = visibility[item.id];
    if (next !== undefined) item.visible = next;
  }
};


export function buildPersonalisationPlan(
  answers: OnboardingAnswers,
  settings: JournalitSettings,
  now: () => number = Date.now
): PersonalisationChange[] {
  const changes: PersonalisationChange[] = [];
  const defaults = DEFAULT_SETTINGS;

  
  if (isDefaultHomeLayout(settings)) {
    const plan = homePlanFor(answers);
    changes.push({
      lever: 'homeWidgets',
      apply: (target) => {
        const home = target.home;
        if (!home) return;
        const createdAt = new Date(now()).toISOString();
        const placements: HomeWidgetPlacement[] = [];
        for (const widgetId of plan.widgets) {
          const definition = AVAILABLE_HOME_WIDGETS.find(
            (widget) => widget.id === widgetId
          );
          if (!definition) continue;
          if (widgetId === 'currentStreak' && plan.streakKind) {
            const instanceId = `currentStreak-onboarding`;
            home.streaks = {
              ...home.streaks,
              [instanceId]: { kind: plan.streakKind, createdAt },
            };
            placements.push({ widgetId, instanceId });
          } else if (widgetId === 'goalsProgress' && plan.goal) {
            const instanceId = `goalsProgress-onboarding`;
            home.goals = {
              ...home.goals,
              [instanceId]: {
                type: plan.goal.type,
                target: plan.goal.target,
                period: 'lifetime',
                createdAt,
              },
            };
            placements.push({ widgetId, instanceId });
          } else if (!definition.configurable) {
            placements.push({ widgetId, instanceId: widgetId });
          }
        }
        home.layouts = {
          ...home.layouts,
          Default: buildHomeLayouts(placements),
        };
        home.activeLayout = 'Default';
      },
    });
  }

  
  const quickLinksAtDefault =
    JSON.stringify(settings.home?.quickLinks) ===
    JSON.stringify(DEFAULT_HOME?.quickLinks);
  const navigationAtDefault =
    JSON.stringify(settings.navigation?.items) ===
    JSON.stringify(defaults.navigation?.items);

  const style = answers.tradingStyle;
  if (style === 'swing' || style === 'position') {
    if (quickLinksAtDefault) {
      changes.push({
        lever: 'homeQuickLinks',
        apply: (target) =>
          setQuickLinkVisibility(target, {
            'todays-drc': false,
            'weekly-review': true,
            'monthly-review': style === 'position',
            'session-mode': false,
          }),
      });
    }
    if (navigationAtDefault) {
      changes.push({
        lever: 'navigation',
        apply: (target) =>
          setNavItemVisibility(target, { 'nav-session-mode': false }),
      });
    }
  }
  if (answers.accountKind === 'prop' && quickLinksAtDefault) {
    changes.push({
      lever: 'homeQuickLinks',
      apply: (target) =>
        moveQuickLinkAfter(target, 'account-dashboard', 'add-trade'),
    });
  }

  
  if (style === 'scalping') {
    if (
      settings.trade.autoOpenCreatedTrades ===
      defaults.trade.autoOpenCreatedTrades
    ) {
      changes.push({
        lever: 'tradeCapture',
        apply: (target) => {
          target.trade.autoOpenCreatedTrades = false;
        },
      });
    }
    if (
      settings.backendIntegration?.showNewTradeNotifications ===
      defaults.backendIntegration?.showNewTradeNotifications
    ) {
      changes.push({
        lever: 'notifications',
        apply: (target) => {
          if (target.backendIntegration) {
            target.backendIntegration.showNewTradeNotifications = false;
          }
        },
      });
    }
  }

  
  if (style === 'swing' || style === 'position') {
    if (
      settings.drc.autoCreateDRCOnNavigation ===
      defaults.drc.autoCreateDRCOnNavigation
    ) {
      changes.push({
        lever: 'reviews',
        apply: (target) => {
          target.drc.autoCreateDRCOnNavigation = false;
          if (style === 'position') {
            target.weekly.autoCreateWeeklyReviewOnNavigation = false;
          }
        },
      });
    }
    if (
      settings.trade.analyticsDateBasis === defaults.trade.analyticsDateBasis
    ) {
      changes.push({
        lever: 'tradeCapture',
        apply: (target) => {
          target.trade.analyticsDateBasis = 'exit';
        },
      });
    }
  }

  
  if (
    answers.accountKind === 'prop' &&
    settings.account?.defaultAccountType ===
      defaults.account?.defaultAccountType &&
    settings.account?.defaultDrawdownType ===
      defaults.account?.defaultDrawdownType
  ) {
    changes.push({
      lever: 'accounts',
      apply: (target) => {
        if (!target.account) return;
        target.account.defaultAccountType = AccountType.EVALUATION;
        target.account.defaultDrawdownType = DrawdownType.EOD_TRAILING;
      },
    });
  }

  
  const asset = answers.assetFocus;
  if (asset && asset !== 'mixed') {
    const layout = settings.trade.tradeFormLayout;
    const defaultLayout = defaults.trade.tradeFormLayout;
    if (
      layout &&
      defaultLayout &&
      layout.assetTypeMode === defaultLayout.assetTypeMode &&
      layout.defaultAssetType === defaultLayout.defaultAssetType
    ) {
      changes.push({
        lever: 'tradeForm',
        apply: (target) => {
          const targetLayout = target.trade.tradeFormLayout;
          if (!targetLayout) return;
          targetLayout.assetTypeMode = 'fixed';
          targetLayout.defaultAssetType = asset;
          if (asset === 'futures') {
            if (targetLayout.takeProfitUnit === defaultLayout.takeProfitUnit) {
              targetLayout.takeProfitUnit = 'size';
            }
            if (
              target.trade.maeMfeDisplayUnit ===
              defaults.trade.maeMfeDisplayUnit
            ) {
              target.trade.maeMfeDisplayUnit = 'ticks';
            }
          }
        },
      });
    }
    if (
      (asset === 'stock' || asset === 'futures' || asset === 'forex') &&
      settings.home?.positionSizeDefaults?.assetType ===
        DEFAULT_HOME?.positionSizeDefaults?.assetType
    ) {
      changes.push({
        lever: 'positionSize',
        apply: (target) => {
          if (!target.home) return;
          target.home.positionSizeDefaults = {
            ...DEFAULT_HOME?.positionSizeDefaults,
            ...target.home.positionSizeDefaults,
            riskPercentage:
              target.home.positionSizeDefaults?.riskPercentage ??
              DEFAULT_HOME?.positionSizeDefaults?.riskPercentage ??
              1,
            assetType: asset,
          };
        },
      });
    }
  }

  return changes;
}
