import React, { memo } from 'react';
import { t } from '../../../../lang/helpers';
import { SkeletonBox } from '../../../shared/SkeletonBox';
import { SkeletonText } from '../../../shared/SkeletonText';

type ReviewWidgetSkeletonVariant = 'trade-review' | 'weekday-review';

interface ReviewWidgetSkeletonProps {
  variant: ReviewWidgetSkeletonVariant;
}

function TradeReviewSkeletonCard() {
  return (
    <div className="journalit-review-widget-skeleton-accordion-header journalit-review-widget-skeleton-accordion-header--trade">
      <SkeletonBox width={16} height={16} borderRadius="5px" />
      <SkeletonText width="150px" height="13px" />
      <SkeletonText width="72px" height="12px" />
      <SkeletonBox width={58} height={20} borderRadius="999px" />
      <span className="journalit-review-widget-skeleton-spacer" />
      <SkeletonBox width={88} height={28} borderRadius="999px" />
    </div>
  );
}

function WeekdayReviewSkeletonRow() {
  return (
    <div className="journalit-review-widget-skeleton-accordion-header journalit-review-widget-skeleton-accordion-header--weekday">
      <SkeletonBox width={16} height={16} borderRadius="5px" />
      <SkeletonText width="118px" height="13px" />
      <span className="journalit-review-widget-skeleton-spacer" />
      <SkeletonBox width={88} height={28} borderRadius="999px" />
    </div>
  );
}

export const ReviewWidgetSkeleton = memo<ReviewWidgetSkeletonProps>(
  ({ variant }) => {
    const isTradeReview = variant === 'trade-review';
    const rowCount = isTradeReview ? 2 : 5;

    return (
      <div
        className={`journalit-review-widget-skeleton journalit-review-widget-skeleton--${variant}`}
        aria-busy="true"
        role="status"
      >
        <span className="journalit-skeleton-screenreader-status">
          {isTradeReview
            ? t('widget.trade-review.loading')
            : t('common.loading')}
        </span>
        {Array.from({ length: rowCount }).map((_, index) =>
          isTradeReview ? (
            <TradeReviewSkeletonCard key={index} />
          ) : (
            <WeekdayReviewSkeletonRow key={index} />
          )
        )}
      </div>
    );
  }
);

ReviewWidgetSkeleton.displayName = 'ReviewWidgetSkeleton';
