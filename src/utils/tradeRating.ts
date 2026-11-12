

const TRADE_RATING_MAX = 5;


export type TradeRating = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;


export const TRADE_RATING_BUCKETS = [5, 4, 3, 2, 1] as const;
export type TradeRatingBucket = (typeof TRADE_RATING_BUCKETS)[number];

export type RatingFilter = `${TradeRatingBucket}` | 'unrated';

const RATING_FILTER_VALUES: readonly RatingFilter[] = [
  '5',
  '4',
  '3',
  '2',
  '1',
  'unrated',
];

const RATING_FILTER_VALUE_SET: ReadonlySet<string> = new Set(
  RATING_FILTER_VALUES
);

export function isRatingFilter(value: unknown): value is RatingFilter {
  return typeof value === 'string' && RATING_FILTER_VALUE_SET.has(value);
}


export function isValidTradeRating(value: number): value is TradeRating {
  return (
    Number.isFinite(value) &&
    value > 0 &&
    value <= TRADE_RATING_MAX &&
    Number.isInteger(value * 2)
  );
}


export function parseTradeRating(value: unknown): TradeRating | undefined {
  const numeric =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : Number.NaN;
  return isValidTradeRating(numeric) ? numeric : undefined;
}


export function applySubmittedTradeRating(
  frontmatter: Record<string, unknown>,
  submission: { tradeRating?: number; clearTradeRating?: boolean }
): void {
  if (submission.tradeRating !== undefined) {
    frontmatter.tradeRating = submission.tradeRating;
  } else if (submission.clearTradeRating) {
    frontmatter.tradeRating = undefined;
  }
}

export function getTradeRatingBucket(rating: number): TradeRatingBucket {
  const wholeStars = Math.floor(rating);
  return TRADE_RATING_BUCKETS.find((bucket) => bucket <= wholeStars) ?? 1;
}

export function getRatingFilterValue(rating: number | undefined): RatingFilter {
  return rating === undefined ? 'unrated' : `${getTradeRatingBucket(rating)}`;
}


export function getTradeRatingBucketLabel(bucket: TradeRatingBucket): string {
  return '★'.repeat(bucket);
}

export function parseTradeRatingBucketLabel(
  label: string
): TradeRatingBucket | undefined {
  return TRADE_RATING_BUCKETS.find(
    (bucket) => getTradeRatingBucketLabel(bucket) === label
  );
}
