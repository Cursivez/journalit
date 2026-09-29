

import { t } from '../../../lang/helpers';
import type { HomeSettings } from '../../../settings/types';
import { getCurrentStreakConfig } from '../../../utils/currentStreakConfig';
import { getEmbeddedNoteFileTitle } from '../../../utils/embeddedNoteConfig';
import { getCurrentStreakKindLabel } from '../widgets/CurrentStreakReview';
import {
  DEFAULT_TOP_BREAKDOWN_CONFIG,
  getTopBreakdownDimensionLabel,
} from '../../../utils/topBreakdownConfig';


export const getHomeWidgetInstanceLabel = (
  home: HomeSettings | undefined,
  widgetType: string,
  instanceId: string
): string | null => {
  switch (widgetType) {
    case 'embeddedNote': {
      const filePath = home?.embeddedNotes?.[instanceId]?.filePath;
      return filePath
        ? getEmbeddedNoteFileTitle(filePath)
        : t('home.widget.embedded-note.select-note');
    }
    case 'currentStreak':
      return getCurrentStreakKindLabel(
        getCurrentStreakConfig(home, instanceId).kind
      );
    case 'setupLeaderboard':
      return t('home.widget.top-breakdown.title', {
        dimension: getTopBreakdownDimensionLabel(
          (home?.topBreakdowns?.[instanceId] ?? DEFAULT_TOP_BREAKDOWN_CONFIG)
            .dimension
        ),
      });
    case 'goalsProgress': {
      const goal = home?.goals?.[instanceId];
      if (!goal) return t('home.widget.goals-progress.set-goal');
      if (goal.type === 'pnl')
        return t('home.widget.goals-progress.header.pnl');
      if (goal.type === 'tradesJournaled') {
        return t('home.widget.goals-progress.header.trades');
      }
      return t('home.widget.goals-progress.header.win-rate');
    }
    default:
      return null;
  }
};
