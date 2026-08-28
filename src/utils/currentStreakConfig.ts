

import type {
  CurrentStreakConfig,
  CurrentStreakKind,
  HomeSettings,
} from '../settings/types';

export const DEFAULT_CURRENT_STREAK_KIND: CurrentStreakKind = 'trade-outcome';

const CURRENT_REVIEW_STREAK_KINDS = [
  'trade-review',
  'drc-review',
  'weekly-review',
  'monthly-review',
] as const;

export type CurrentReviewStreakKind =
  (typeof CURRENT_REVIEW_STREAK_KINDS)[number];

export type CurrentScheduledReviewStreakKind = Exclude<
  CurrentReviewStreakKind,
  'trade-review'
>;

export const CURRENT_STREAK_KINDS = [
  'trade-outcome',
  ...CURRENT_REVIEW_STREAK_KINDS,
] as const satisfies readonly CurrentStreakKind[];

const includesString = <T extends string>(
  values: readonly T[],
  value: string
): value is T => values.some((candidate) => candidate === value);

export const isCurrentReviewStreakKind = (
  kind: CurrentStreakKind
): kind is CurrentReviewStreakKind =>
  includesString(CURRENT_REVIEW_STREAK_KINDS, kind);

export const isCurrentScheduledReviewStreakKind = (
  kind: CurrentStreakKind
): kind is CurrentScheduledReviewStreakKind =>
  isCurrentReviewStreakKind(kind) && kind !== 'trade-review';

const isCurrentStreakKind = (value: unknown): value is CurrentStreakKind =>
  typeof value === 'string' && includesString(CURRENT_STREAK_KINDS, value);

const createCurrentStreakConfig = (
  kind: CurrentStreakKind = DEFAULT_CURRENT_STREAK_KIND,
  createdAt: string = new Date().toISOString()
): CurrentStreakConfig => ({
  kind,
  createdAt,
});


export const getCurrentStreakConfig = (
  home: HomeSettings | undefined,
  instanceId: string
): CurrentStreakConfig => {
  const stored = home?.streaks?.[instanceId];

  if (!stored || !isCurrentStreakKind(stored.kind)) {
    return createCurrentStreakConfig();
  }

  return {
    kind: stored.kind,
    createdAt:
      typeof stored.createdAt === 'string' && stored.createdAt.length > 0
        ? stored.createdAt
        : new Date().toISOString(),
  };
};


export const setCurrentStreakConfig = (
  home: HomeSettings,
  instanceId: string,
  kind: CurrentStreakKind
): void => {
  home.streaks ??= {};
  const previous = getCurrentStreakConfig(home, instanceId);
  home.streaks[instanceId] = {
    kind,
    createdAt: previous.createdAt,
  };
};
