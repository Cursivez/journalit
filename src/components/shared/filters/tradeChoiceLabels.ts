

import { t, type TranslationKey } from '../../../lang/helpers';
import type {
  DirectionFilter,
  ImageAnnotationStatusFilter,
  ReviewStatusFilter,
  TradeStatus,
  TradeType,
} from '../../../services/tradelog/types';
import {
  TRADE_BIAS_ALIGNMENTS,
  type TradeBiasAlignment,
} from '../../../services/marketBias/tradeMarketBias';
import { tradeBiasAlignmentLabel } from '../../../services/marketBias/tradeMarketBiasLabel';
import {
  getRatingFilterValue,
  getTradeRatingBucketLabel,
  TRADE_RATING_BUCKETS,
  type RatingFilter,
} from '../../../utils/tradeRating';

export const STATUS_OPTIONS: Array<{
  value: TradeStatus;
  labelKey: TranslationKey;
}> = [
  { value: 'open', labelKey: 'tradelog.filter.open' },
  { value: 'win', labelKey: 'tradelog.filter.winners' },
  { value: 'loss', labelKey: 'tradelog.filter.losers' },
  { value: 'breakeven', labelKey: 'tradelog.filter.breakeven' },
  { value: 'cancelled', labelKey: 'filter.menu.status.cancelled' },
];

export const DIRECTION_OPTIONS: Array<{
  value: DirectionFilter;
  labelKey: TranslationKey;
}> = [
  { value: 'long', labelKey: 'filter.modal.direction.long-call' },
  { value: 'short', labelKey: 'filter.modal.direction.short-put' },
];

export const REVIEW_STATUS_OPTIONS: Array<{
  value: ReviewStatusFilter;
  labelKey: TranslationKey;
}> = [
  { value: 'reviewed', labelKey: 'filter.modal.review-status.reviewed' },
  { value: 'unreviewed', labelKey: 'filter.modal.review-status.unreviewed' },
];

export const TRADE_TYPE_OPTIONS: Array<{
  value: TradeType;
  labelKey: TranslationKey;
}> = [
  { value: 'regular', labelKey: 'tradelog.type.regular' },
  { value: 'missed', labelKey: 'tradelog.type.missed' },
  { value: 'backtest', labelKey: 'tradelog.type.backtest' },
];

export const IMAGE_ANNOTATION_OPTIONS: Array<{
  value: ImageAnnotationStatusFilter;
  labelKey: TranslationKey;
}> = [
  { value: 'tagged', labelKey: 'filter.modal.image.status.tagged' },
  { value: 'untagged', labelKey: 'filter.modal.image.status.untagged' },
  { value: 'hasNotes', labelKey: 'filter.modal.image.status.has-notes' },
  { value: 'noNotes', labelKey: 'filter.modal.image.status.no-notes' },
];


export function ratingFilterOptions(): Array<{
  value: RatingFilter;
  label: string;
}> {
  return [
    ...TRADE_RATING_BUCKETS.map((bucket) => ({
      value: getRatingFilterValue(bucket),
      label: getTradeRatingBucketLabel(bucket),
    })),
    { value: 'unrated', label: t('filter.menu.rating.unrated') },
  ];
}

function selectedLabels<V extends string>(
  options: ReadonlyArray<
    { value: V; labelKey: TranslationKey } | { value: V; label: string }
  >,
  selected: readonly V[]
): string[] {
  const chosen = new Set<V>(selected);
  const labels: string[] = [];
  for (const option of options) {
    if (!chosen.has(option.value)) continue;
    labels.push('label' in option ? option.label : t(option.labelKey));
  }
  return labels;
}


export function describeTradeChoiceFilters(filters: {
  tradeTypes: readonly TradeType[];
  statuses: readonly TradeStatus[];
  directions: readonly DirectionFilter[];
  ratings: readonly RatingFilter[];
  marketBias: readonly TradeBiasAlignment[];
  reviewStatus: readonly ReviewStatusFilter[];
  imageAnnotationStatus?: readonly ImageAnnotationStatusFilter[];
}): string[] {
  return [
    ...selectedLabels(TRADE_TYPE_OPTIONS, filters.tradeTypes),
    ...selectedLabels(STATUS_OPTIONS, filters.statuses),
    ...selectedLabels(DIRECTION_OPTIONS, filters.directions),
    ...selectedLabels(ratingFilterOptions(), filters.ratings),
    ...selectedLabels(
      TRADE_BIAS_ALIGNMENTS.map((value) => ({
        value,
        label: tradeBiasAlignmentLabel(value),
      })),
      filters.marketBias
    ),
    ...selectedLabels(REVIEW_STATUS_OPTIONS, filters.reviewStatus),
    ...selectedLabels(
      IMAGE_ANNOTATION_OPTIONS,
      filters.imageAnnotationStatus ?? []
    ),
  ];
}
