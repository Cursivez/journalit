import React, { useEffect, useReducer } from 'react';
import JournalitPlugin from '../../../main';
import { t, tPlural } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  AlertCircle,
  ChevronRight,
  Flame,
} from '../../shared/icons/ObsidianIcon';
import { useEventBus } from '../../../hooks/useEventBus';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import type { CurrentStreakKind } from '../../../settings/types';
import type {
  calculateReviewStreakSummary,
  ReviewStreakItem,
} from '../../../utils/reviewStreaks';
import {
  isCurrentScheduledReviewStreakKind,
  type CurrentReviewStreakKind,
  type CurrentScheduledReviewStreakKind,
} from '../../../utils/currentStreakConfig';
import { CurrentStreakSkeletonContent } from './CurrentStreakSkeleton';

type ReviewStreakSummary = ReturnType<typeof calculateReviewStreakSummary>;

interface ReviewLoadState {
  items: ReviewStreakItem[];
  resolvedKind: CurrentScheduledReviewStreakKind | null;
  successfulKind: CurrentScheduledReviewStreakKind | null;
  failedKind: CurrentScheduledReviewStreakKind | null;
  refreshToken: number;
  now: number;
}

type ReviewLoadAction =
  | { type: 'reset' }
  | { type: 'refresh'; now: number }
  | {
      type: 'loaded';
      kind: CurrentScheduledReviewStreakKind;
      items: ReviewStreakItem[];
    }
  | { type: 'failed'; kind: CurrentScheduledReviewStreakKind };

interface ReviewState {
  items: ReviewStreakItem[];
  loading: boolean;
  error: boolean;
  now: number;
}

const reviewLoadReducer = (
  state: ReviewLoadState,
  action: ReviewLoadAction
): ReviewLoadState => {
  switch (action.type) {
    case 'reset':
      return {
        items: [],
        resolvedKind: null,
        successfulKind: null,
        failedKind: null,
        refreshToken: state.refreshToken,
        now: state.now,
      };
    case 'refresh':
      return {
        ...state,
        refreshToken: state.refreshToken + 1,
        now: action.now,
      };
    case 'loaded':
      return {
        ...state,
        items: action.items,
        resolvedKind: action.kind,
        successfulKind: action.kind,
        failedKind: null,
      };
    case 'failed':
      return {
        ...state,
        items: state.successfulKind === action.kind ? state.items : [],
        resolvedKind: action.kind,
        failedKind: action.kind,
      };
  }
};

export const getCurrentStreakKindLabel = (kind: CurrentStreakKind): string => {
  switch (kind) {
    case 'trade-outcome':
      return t('home.widget.streak.kind.trade-outcome');
    case 'trade-review':
      return t('home.widget.streak.kind.trade-review');
    case 'drc-review':
      return t('home.widget.streak.kind.drc-review');
    case 'weekly-review':
      return t('home.widget.streak.kind.weekly-review');
    case 'monthly-review':
      return t('home.widget.streak.kind.monthly-review');
  }
};

export const useReviewStreakState = (
  plugin: JournalitPlugin,
  kind: CurrentStreakKind
): ReviewState => {
  const reviewKind = isCurrentScheduledReviewStreakKind(kind) ? kind : null;
  const [state, dispatch] = useReducer(reviewLoadReducer, {
    items: [],
    resolvedKind: null,
    successfulKind: null,
    failedKind: null,
    refreshToken: 0,
    now: Date.now(),
  });

  useEventBus(
    'review:changed',
    (payload) => {
      if (
        payload.action !== 'opened' &&
        (payload.type === 'drc' ||
          payload.type === 'weekly' ||
          payload.type === 'monthly')
      ) {
        dispatch({ type: 'refresh', now: Date.now() });
      }
    },
    reviewKind !== null
  );

  useEventBus(
    'folder-path:changed',
    () => dispatch({ type: 'refresh', now: Date.now() }),
    reviewKind !== null
  );

  useEffect(() => {
    if (!reviewKind) return;

    let timeoutId: number | null = null;
    const scheduleNextDay = () => {
      const now = new Date();
      const nextDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      timeoutId = window.setTimeout(
        () => {
          dispatch({ type: 'refresh', now: Date.now() });
          scheduleNextDay();
        },
        Math.max(1, nextDay.getTime() - now.getTime())
      );
    };

    scheduleNextDay();
    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [reviewKind]);

  useEffect(() => {
    if (!reviewKind) {
      dispatch({ type: 'reset' });
      return;
    }

    let active = true;

    void (async () => {
      try {
        const service = plugin.serviceManager.getReviewStreakService();
        const items = await service.getItems(reviewKind);
        if (active) dispatch({ type: 'loaded', kind: reviewKind, items });
      } catch (error) {
        if (active) dispatch({ type: 'failed', kind: reviewKind });
        console.error(
          '[CurrentStreakWidget] Failed to load review streak:',
          error
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [plugin, reviewKind, state.refreshToken]);

  return {
    items: state.items,
    loading: reviewKind !== null && state.resolvedKind !== reviewKind,
    error:
      reviewKind !== null &&
      state.failedKind === reviewKind &&
      state.successfulKind !== reviewKind,
    now: state.now,
  };
};

interface ReviewViewProps {
  kind: CurrentReviewStreakKind;
  loading: boolean;
  error: boolean;
  summary: ReviewStreakSummary;
}

const REVIEW_COPY_KEYS = {
  'trade-review': {
    active: 'home.widget.streak.reviewed-trades-in-a-row',
    missed: 'home.widget.streak.missed-trades',
  },
  'drc-review': {
    active: 'home.widget.streak.reviewed-days-in-a-row',
    missed: 'home.widget.streak.missed-days',
  },
  'weekly-review': {
    active: 'home.widget.streak.reviewed-weeks-in-a-row',
    missed: 'home.widget.streak.missed-weeks',
  },
  'monthly-review': {
    active: 'home.widget.streak.reviewed-months-in-a-row',
    missed: 'home.widget.streak.missed-months',
  },
} as const;

export const getReviewInsight = (
  kind: CurrentReviewStreakKind,
  summary: ReviewStreakSummary
): string => {
  if (!summary.hasReviewedAnchor) {
    if (kind === 'trade-review' && (summary.waitingCount ?? 0) > 0) {
      return tPlural(
        'home.widget.unreviewed.need-review',
        summary.waitingCount ?? 0
      );
    }
    return t('home.widget.streak.start-reviewing');
  }

  if (summary.missedRequiredUnits > 0) {
    return tPlural(REVIEW_COPY_KEYS[kind].missed, summary.missedRequiredUnits);
  }

  return t('home.widget.streak.keep-reviewing');
};

export const getReviewActiveLabel = (
  kind: CurrentReviewStreakKind,
  count: number
): string => tPlural(REVIEW_COPY_KEYS[kind].active, count);

export const CurrentReviewStreakView: React.FC<ReviewViewProps> = ({
  kind,
  loading,
  error,
  summary,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();

  if (loading) {
    return <CurrentStreakSkeletonContent />;
  }

  if (error) {
    return (
      <>
        <div className="journalit-home-streak__header">
          <span>{getCurrentStreakKindLabel(kind)}</span>
          <ChevronRight
            size={12}
            className="journalit-home-streak__header-chevron"
            aria-hidden="true"
          />
        </div>
        <div
          className="journalit-home-streak__hero"
          style={cssVars({
            '--journalit-home-streak-color': 'var(--color-red)',
          })}
        >
          <AlertCircle size={24} className="journalit-home-streak__icon" />
          <div className="journalit-home-streak__label">
            {t('dashboard.error.load-failed')}
          </div>
          <div className="journalit-home-streak__insight" />
        </div>
      </>
    );
  }

  const hasStreak = summary.currentStreak > 0;
  const isMasked = shouldMask('metric');
  const heroValue = isMasked
    ? formatValue({ kind: 'metric', value: summary.currentStreak })
    : hasStreak
      ? summary.currentStreak
      : '—';

  return (
    <>
      <div className="journalit-home-streak__header">
        <span>{getCurrentStreakKindLabel(kind)}</span>
        <ChevronRight
          size={12}
          className="journalit-home-streak__header-chevron"
          aria-hidden="true"
        />
      </div>
      <div
        className="journalit-home-streak__hero"
        style={cssVars({
          '--journalit-home-streak-color': hasStreak
            ? isMasked
              ? 'var(--text-muted)'
              : 'var(--color-green)'
            : 'var(--text-muted)',
        })}
      >
        {hasStreak && !isMasked && (
          <Flame size={24} className="journalit-home-streak__icon" />
        )}
        <div className="journalit-home-streak__value">{heroValue}</div>
        <div className="journalit-home-streak__label">
          {isMasked
            ? t('settings.general.privacy-mode')
            : hasStreak
              ? getReviewActiveLabel(kind, summary.currentStreak)
              : t('home.widget.streak.no-review-streak')}
        </div>
        <div className="journalit-home-streak__insight">
          {isMasked ? '' : getReviewInsight(kind, summary)}
        </div>
      </div>
    </>
  );
};
